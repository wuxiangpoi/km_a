import {min, remove} from '../../../../../../libs/array';

var tplHtml = require('./editorElementGridding.html');

module.exports = function (app) {

    app.directive('editorElementGridding', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                originalPixel: '=',
                page: '=',
                currentElement: '=',
                isShowGridding: '=',
                autoAnchor: '='
            },
            link: function (scope, element, attrs) {

                scope.$watch('isShowGridding', function (isShowGridding) {
                    scope.isShowGridding = isShowGridding;
                    redraw();
                });

                scope.$watch('autoAnchor', function (isAutoAnchor) {
                    scope.autoAnchor = isAutoAnchor;
                    redraw();
                });

                var layoutHorizontalLinePercents = [];
                var layoutVerticalLinePercents = [];
                var watcher = scope.$watch('currentElement', function (currentElement) {
                    layoutHorizontalLinePercents.splice(0, layoutHorizontalLinePercents.length);
                    layoutVerticalLinePercents.splice(0, layoutVerticalLinePercents.length);
                    if (currentElement !== null) {
                        var allLayouts = scope.page.elements.map(function (ele) {
                            return ele.layout;
                        });
                        remove(allLayouts, currentElement.layout);

                        layoutHorizontalLinePercents.push(0);
                        layoutHorizontalLinePercents.push(50);
                        layoutHorizontalLinePercents.push(100);
                        layoutVerticalLinePercents.push(0);
                        layoutVerticalLinePercents.push(50);
                        layoutVerticalLinePercents.push(100);

                        allLayouts.forEach(function (layout) {
                            layoutHorizontalLinePercents.push(layout.top);
                            layoutHorizontalLinePercents.push(layout.top + layout.height / 2);
                            layoutHorizontalLinePercents.push(layout.top + layout.height);
                            layoutVerticalLinePercents.push(layout.left);
                            layoutVerticalLinePercents.push(layout.left + layout.width / 2);
                            layoutVerticalLinePercents.push(layout.left + layout.width);
                        });
                    }
                });

                var pixelWidthInCanvas = 0;
                var pixelHeightInCanvas = 0;
                var horizontalDistancePercent = 0;
                var verticalDistancePercent = 0;
                var watcher2 = scope.$watchGroup(['pixelHorizontal', 'pixelVertical'], function (args) {
                    var pixelHorizontal = args[0];
                    var pixelVertical = args[1];
                    if (pixelHorizontal > pixelVertical) {
                        pixelWidthInCanvas = 1000;
                        pixelHeightInCanvas = (pixelVertical / pixelHorizontal) * 1000;
                    } else {
                        pixelWidthInCanvas = (pixelHorizontal / pixelVertical) * 1000;
                        pixelHeightInCanvas = 1000;
                    }
                    horizontalDistancePercent = 20 * 100 / pixelHorizontal;
                    verticalDistancePercent = 20 * 100 / pixelVertical;
                });

                //销毁时清除
                scope.$on('$destroy', function () {
                    watcher();//清除监视
                    watcher2();
                });

                var ctx = element.find('canvas')[0].getContext("2d");
                var horizontalLinePercents = [];
                var verticalLinePercents = [];
                var horizontalCanvasLine = null;
                var verticalCanvasLine = null;
                var horizontalPercent = null;
                var verticalPercent = null;

                function getNearest(arr, distance, val) {
                    var nearest = min(arr, function (item) {
                        return Math.abs(item - val);
                    });
                    if (nearest !== null && Math.abs(nearest - val) > distance) {
                        return null;
                    }
                    return nearest;
                }

                function redraw() {
                    ctx.clearRect(0, 0, 1000, 1000);

                    if (scope.isShowGridding) {
                        ctx.beginPath();
                        ctx.save();
                        ctx.translate(500, 500);

                        ctx.lineWidth = 1;
                        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';

                        for (var i = 0; i < 20; i++) {
                            var ins = i * 25;
                            //画横向线
                            ctx.moveTo(-500, ins);
                            ctx.lineTo(500, ins);
                            ctx.moveTo(-500, -ins);
                            ctx.lineTo(500, -ins);

                            //画纵向线
                            ctx.moveTo(-ins, -500);
                            ctx.lineTo(-ins, 500);
                            ctx.moveTo(ins, -500);
                            ctx.lineTo(ins, 500);
                        }

                        ctx.stroke();
                        ctx.restore();
                    }


                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#00a0e9';

                    if (scope.autoAnchor) {
                        if (horizontalCanvasLine !== null) {
                            var pixelTopInCanvas = (1000 - pixelHeightInCanvas) / 2 + horizontalCanvasLine * pixelHeightInCanvas / 100;
                            //画虚线
                            (function () {
                                for (var i = 0; i < 50; i++) {
                                    ctx.moveTo(20 * i + 4, pixelTopInCanvas);
                                    ctx.lineTo(20 * i + 16, pixelTopInCanvas);
                                }
                            })();
                        }

                        if (verticalCanvasLine != null) {
                            var pixelLeftInCanvas = (1000 - pixelWidthInCanvas) / 2 + verticalCanvasLine * pixelWidthInCanvas / 100;
                            //画虚线
                            (function () {
                                for (var i = 0; i < 50; i++) {
                                    ctx.moveTo(pixelLeftInCanvas, 20 * i + 4);
                                    ctx.lineTo(pixelLeftInCanvas, 20 * i + 16);
                                }
                            })();
                        }
                    }

                    ctx.stroke();
                }

                scope.$on('drag-start-x', function (event, data) {
                    verticalLinePercents = layoutVerticalLinePercents.slice(0);
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                });

                scope.$on('drag-move-x', function (event) {
                    var layout = scope.currentElement.layout;
                    var nearestHorizontalLeft = getNearest(verticalLinePercents, horizontalDistancePercent, layout.left);
                    var nearestHorizontalCenter = getNearest(verticalLinePercents, horizontalDistancePercent, layout.left + layout.width / 2);
                    var nearestHorizontalRight = getNearest(verticalLinePercents, horizontalDistancePercent, layout.left + layout.width);
                    //console.log(nearestHorizontalLeft);
                    //console.log(nearestHorizontalCenter);
                    //console.log(nearestHorizontalRight);

                    var distances = [];
                    if (nearestHorizontalLeft !== null) {
                        distances.push({
                            type: 1,//左边
                            value: Math.abs(nearestHorizontalLeft - layout.left)
                        });
                    }
                    if (nearestHorizontalCenter !== null) {
                        distances.push({
                            type: 2,//中间
                            value: Math.abs(nearestHorizontalCenter - layout.left - layout.width / 2)
                        });
                    }
                    if (nearestHorizontalRight !== null) {
                        distances.push({
                            type: 3,//右边
                            value: Math.abs(nearestHorizontalRight - layout.left - layout.width)
                        });
                    }

                    if (distances.length !== 0) {
                        var minDistance = min(distances, function (item) {
                            return item.value;
                        });
                        if (minDistance.type === 1) {//左边对齐
                            if (nearestHorizontalLeft + layout.width <= 100) {
                                if (nearestHorizontalLeft !== verticalCanvasLine) {
                                    verticalPercent = verticalCanvasLine = nearestHorizontalLeft;
                                    redraw();
                                }
                            }
                        } else if (minDistance.type === 2) {//中间对齐
                            if (nearestHorizontalCenter >= layout.width / 2 && nearestHorizontalCenter <= 100 - layout.width / 2) {
                                if (nearestHorizontalCenter !== verticalCanvasLine) {
                                    verticalCanvasLine = nearestHorizontalCenter;
                                    verticalPercent = nearestHorizontalCenter - layout.width / 2;
                                    redraw();
                                }
                            }
                        } else if (minDistance.type === 3) {//右边对齐
                            if (nearestHorizontalRight >= layout.width) {
                                if (nearestHorizontalRight !== verticalCanvasLine) {
                                    verticalCanvasLine = nearestHorizontalRight;
                                    verticalPercent = nearestHorizontalRight - layout.width;
                                    redraw();
                                }
                            }
                        }
                    } else {
                        if (verticalCanvasLine !== null) {
                            verticalPercent = verticalCanvasLine = null;
                            redraw();
                        }
                    }
                });

                scope.$on('drag-start-y', function (event, data) {
                    horizontalLinePercents = layoutHorizontalLinePercents.slice(0);
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                });

                scope.$on('drag-move-y', function (event) {
                    var layout = scope.currentElement.layout;
                    var nearestHorizontalTop = getNearest(horizontalLinePercents, verticalDistancePercent, layout.top);
                    var nearestHorizontalMiddle = getNearest(horizontalLinePercents, verticalDistancePercent, layout.top + layout.height / 2);
                    var nearestHorizontalBottom = getNearest(horizontalLinePercents, verticalDistancePercent, layout.top + layout.height);
                    //console.log(nearestHorizontalTop);
                    //console.log(nearestHorizontalMiddle);
                    //console.log(nearestHorizontalBottom);

                    var distances = [];
                    if (nearestHorizontalTop !== null) {
                        distances.push({
                            type: 1,//顶部
                            value: Math.abs(nearestHorizontalTop - layout.top)
                        });
                    }
                    if (nearestHorizontalMiddle !== null) {
                        distances.push({
                            type: 2,//中间
                            value: Math.abs(nearestHorizontalMiddle - layout.top - layout.height / 2)
                        });
                    }
                    if (nearestHorizontalBottom !== null) {
                        distances.push({
                            type: 3,//底部
                            value: Math.abs(nearestHorizontalBottom - layout.top - layout.height)
                        });
                    }

                    if (distances.length !== 0) {
                        var minDistance = min(distances, function (item) {
                            return item.value;
                        });
                        if (minDistance.type === 1) {//顶部对齐
                            if (nearestHorizontalTop + layout.height <= 100) {
                                if (nearestHorizontalTop !== horizontalCanvasLine) {
                                    horizontalPercent = horizontalCanvasLine = nearestHorizontalTop;
                                    redraw();
                                }
                            }
                        } else if (minDistance.type === 2) {//中间对齐
                            if (nearestHorizontalMiddle >= layout.height / 2 && nearestHorizontalMiddle <= 100 - layout.height / 2) {
                                if (nearestHorizontalMiddle !== horizontalCanvasLine) {
                                    horizontalCanvasLine = nearestHorizontalMiddle;
                                    horizontalPercent = nearestHorizontalMiddle - layout.height / 2;
                                    redraw();
                                }
                            }
                        } else if (minDistance.type === 3) {//底部对齐
                            if (nearestHorizontalBottom >= layout.height) {
                                if (nearestHorizontalBottom !== horizontalCanvasLine) {
                                    horizontalCanvasLine = nearestHorizontalBottom;
                                    horizontalPercent = nearestHorizontalBottom - layout.height;
                                    redraw();
                                }
                            }
                        }
                    } else {
                        if (horizontalCanvasLine !== null) {
                            horizontalPercent = horizontalCanvasLine = null;
                            redraw();
                        }
                    }
                });

                scope.$on('drag-start-n', function (event, data) {
                    horizontalLinePercents = layoutHorizontalLinePercents.filter(function (p) {
                        return p < data.startTop + data.startHeight;
                    });
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                });

                scope.$on('drag-move-n', function (event) {
                    var nearestHorizontal = getNearest(horizontalLinePercents, verticalDistancePercent, scope.currentElement.layout.top);
                    if (nearestHorizontal !== horizontalCanvasLine) {
                        horizontalPercent = horizontalCanvasLine = nearestHorizontal;
                        redraw();
                    }
                });

                scope.$on('drag-start-s', function (event, data) {
                    horizontalLinePercents = layoutHorizontalLinePercents.filter(function (p) {
                        return p > data.startTop;
                    });
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                });

                scope.$on('drag-move-s', function (event) {
                    var nearestHorizontal = getNearest(horizontalLinePercents, verticalDistancePercent, scope.currentElement.layout.top + scope.currentElement.layout.height);
                    if (nearestHorizontal !== horizontalCanvasLine) {
                        horizontalPercent = horizontalCanvasLine = nearestHorizontal;
                        redraw();
                    }
                });

                scope.$on('drag-start-w', function (event, data) {
                    verticalLinePercents = layoutVerticalLinePercents.filter(function (p) {
                        return p < data.startLeft + data.startWidth;
                    });
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                });

                scope.$on('drag-move-w', function (event) {
                    var nearestVertical = getNearest(verticalLinePercents, horizontalDistancePercent, scope.currentElement.layout.left);
                    if (nearestVertical !== verticalCanvasLine) {
                        verticalPercent = verticalCanvasLine = nearestVertical;
                        redraw();
                    }
                });

                scope.$on('drag-start-e', function (event, data) {
                    verticalLinePercents = layoutVerticalLinePercents.filter(function (p) {
                        return p > data.startLeft;
                    });
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                });

                scope.$on('drag-move-e', function (event) {
                    var nearestVertical = getNearest(verticalLinePercents, horizontalDistancePercent, scope.currentElement.layout.left + scope.currentElement.layout.width);
                    if (nearestVertical !== verticalCanvasLine) {
                        verticalPercent = verticalCanvasLine = nearestVertical;
                        redraw();
                    }
                });

                scope.$on('drag-end', function (event, callback) {
                    if (scope.autoAnchor) {
                        callback(horizontalPercent, verticalPercent);
                    } else {
                        callback(null, null);
                    }
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                    redraw();
                });

            }
        };
    });

};
