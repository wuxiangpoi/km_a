var clear = require('../../../../../../libs/array').clear;

var tplHtml = require('./editorElementDragger.html');

module.exports = function (app) {

    app.directive('editorElementDragger', ['editorRedoUndoService', function (editorRedoUndoService) {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                horizontalSize: '=',
                verticalSize: '=',
                fontSize: '=',
                ele: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {

                //快捷键
                (function () {
                    var xPercentPerPixel = 100 / $scope.pixelHorizontal;
                    var yPercentPerPixel = 100 / $scope.pixelVertical;

                    function onKeyDown(e) {
                        if (!e.ctrlKey && !e.altKey && e.which !== 46) {//ctrl和alt键都没有被按下，也不是delete键
                            $scope.$apply(function () {
                                var layout = $scope.ele.layout;
                                var oldLeft = layout.left;
                                var oldTop = layout.top;
                                switch (e.which) {
                                    case 37://left
                                        e.preventDefault();
                                        if (layout.left > 0) {
                                            editorRedoUndoService.saveAndExecRedo(function () {
                                                var nowLeft = layout.left - xPercentPerPixel;
                                                if (nowLeft < 0) {
                                                    layout.left = 0;
                                                } else {
                                                    layout.left = nowLeft;
                                                }
                                            }, function () {
                                                layout.left = oldLeft;
                                            }, $scope);
                                        }
                                        break;
                                    case 38://top
                                        e.preventDefault();
                                        if (layout.top > 0) {
                                            editorRedoUndoService.saveAndExecRedo(function () {
                                                var nowTop = layout.top - yPercentPerPixel;
                                                if (nowTop < 0) {
                                                    layout.top = 0;
                                                } else {
                                                    layout.top = nowTop;
                                                }
                                            }, function () {
                                                layout.top = oldTop;
                                            }, $scope);
                                        }
                                        break;
                                    case 39://right
                                        e.preventDefault();
                                        if (layout.left + layout.width < 100) {
                                            editorRedoUndoService.saveAndExecRedo(function () {
                                                var nowLeft = layout.left + xPercentPerPixel;
                                                if (nowLeft > 100 - layout.width) {
                                                    layout.left = 100 - layout.width;
                                                } else {
                                                    layout.left = nowLeft;
                                                }
                                            }, function () {
                                                layout.left = oldLeft;
                                            }, $scope);
                                        }
                                        break;
                                    case 40://bottom
                                        e.preventDefault();
                                        if (layout.top + layout.height < 100) {
                                            editorRedoUndoService.saveAndExecRedo(function () {
                                                var nowTop = layout.top + yPercentPerPixel;
                                                if (nowTop > 100 - layout.height) {
                                                    layout.top = 100 - layout.height;
                                                } else {
                                                    layout.top = nowTop;
                                                }
                                            }, function () {
                                                layout.top = oldTop;
                                            }, $scope);
                                        }
                                        break;
                                    default :
                                        break;
                                }
                            });
                        }
                    }

                    document.addEventListener('keydown', onKeyDown, false);

                    //销毁时清除
                    $scope.$on('$destroy', function () {
                        document.removeEventListener('keydown', onKeyDown, false);
                    });
                })();
            }],
            link: function (scope, elements, attrs) {
                var dotts = elements.find('span');
                var this_dom = elements[0];
                var dot_nw = dotts[0];//左上
                var dot_n = dotts[1];//中上
                var dot_ne = dotts[2];//右上
                var dot_w = dotts[3];//左中
                var dot_e = dotts[4];//右中
                var dot_sw = dotts[5];//左下
                var dot_s = dotts[6];//中下
                var dot_se = dotts[7];//右下
                var btn_close = elements.find('button')[0];

                (function () {
                    function closeClick(e) {
                        e.stopPropagation();
                        scope.$apply(function () {
                            scope.$emit('editor-element-delete', scope.ele);
                        });
                    }

                    btn_close.addEventListener('click', closeClick, false);
                    //销毁时移除事件
                    scope.$on('$destroy', function () {
                        btn_close.removeEventListener('click', closeClick, false);
                    });
                })();

                //右键菜单
                (function () {

                    function onContextmenu(e) {
                        e.preventDefault();
                        //console.log(e);
                    }

                    this_dom.addEventListener('contextmenu', onContextmenu, false);

                    //销毁时移除事件
                    scope.$on('$destroy', function () {
                        this_dom.removeEventListener('contextmenu', onContextmenu, false);
                    });
                })();

                //双击事件
                (function () {
                    function dbClick(e) {
                        e.stopPropagation();
                        var curEle = scope.ele;
                        if (curEle.type === 200) {
                            var data = curEle.data;

                            scope.$emit('on-select-single-image', data.image, function (newImage) {
                                var oldImage = data.image;

                                editorRedoUndoService.saveAndExecRedo(function () {
                                    data.image = newImage;
                                }, function () {
                                    data.image = oldImage;
                                }, scope);
                            });
                        } else if (curEle.type === 250) {
                            var images = curEle.data.images;

                            scope.$emit('on-select-multiple-image', images, function (newImages) {
                                var oldImages = images.slice(0);

                                editorRedoUndoService.saveAndExecRedo(function () {
                                    clear(images);//清空
                                    newImages.forEach(function (image) {
                                        images.push(image);
                                    });
                                }, function () {
                                    clear(images);//清空
                                    oldImages.forEach(function (image) {
                                        images.push(image);
                                    });
                                }, scope);
                            });

                        } else if (curEle.type === 300) {
                            var data = curEle.data;

                            scope.$emit('on-select-single-video', data.video, function (newVideo) {
                                var oldVideo = data.video;

                                editorRedoUndoService.saveAndExecRedo(function () {
                                    data.video = newVideo;
                                }, function () {
                                    data.video = oldVideo;
                                }, scope);
                            });
                        } else if (curEle.type === 350) {
                            var videos = curEle.data.videos;

                            scope.$emit('on-select-multiple-video', videos, function (newVideos) {
                                var oldVideos = videos.slice(0);

                                editorRedoUndoService.saveAndExecRedo(function () {
                                    clear(videos);//清空
                                    newVideos.forEach(function (video) {
                                        videos.push(video);
                                    });
                                }, function () {
                                    clear(videos);//清空
                                    oldVideos.forEach(function (video) {
                                        videos.push(video);
                                    });
                                }, scope);
                            });
                        }
                    }

                    this_dom.addEventListener('dblclick', dbClick, false);
                    //销毁时移除事件
                    scope.$on('$destroy', function () {
                        this_dom.removeEventListener('dblclick', dbClick, false);
                    });
                })();

                //防止点击冒泡
                (function () {
                    var func = function (e) {
                        e.stopPropagation();
                    };
                    this_dom.addEventListener('click', func, false);
                    //销毁时移除事件
                    scope.$on('$destroy', function () {
                        this_dom.removeEventListener('click', func, false);
                    });
                })();


                //位置拖拽
                (function () {
                    var isStart = false;
                    var startX = 0, startY = 0;
                    var startLeft = 0, startTop = 0;
                    var startWidth = 0, startHeight = 0;
                    var cur_dot = null;

                    function move(percentX, percentY) {
                        var layout = scope.ele.layout;

                        var nowLeft = startLeft + percentX;
                        var nowTop = startTop + percentY;

                        if (nowLeft < 0) {
                            layout.left = 0;
                        } else if (nowLeft > 100 - startWidth) {
                            layout.left = 100 - startWidth;
                        } else {
                            layout.left = nowLeft;
                            if (percentX !== 0) {
                                scope.$emit('dragMoveX');
                            }
                        }

                        if (nowTop < 0) {
                            layout.top = 0;
                        } else if (nowTop > 100 - startHeight) {
                            layout.top = 100 - startHeight;
                        } else {
                            layout.top = nowTop;
                            if (percentY !== 0) {
                                scope.$emit('dragMoveY');
                            }
                        }

                        //layout.left = startLeft + percentX;
                        //layout.top = startTop + percentY;
                    }

                    function drag_n(percentY) {
                        if (percentY === 0) {
                            return;
                        }
                        var layout = scope.ele.layout;
                        var mHeight = startHeight - percentY;
                        if (mHeight > 0) {
                            var nowTop = startTop + percentY;
                            if (nowTop < 0) {
                                layout.top = 0;
                                layout.height = startHeight + startTop;
                            } else {
                                layout.top = nowTop;
                                layout.height = mHeight;
                                scope.$emit('dragMoveN');
                            }

                            //layout.top = startTop + percentY;
                            //layout.height = mHeight;
                        } else {
                            layout.top = startTop + startHeight;
                            layout.height = 0;
                        }
                    }

                    function drag_s(percentY) {
                        if (percentY === 0) {
                            return;
                        }
                        var layout = scope.ele.layout;
                        var mHeight = startHeight + percentY;
                        if (mHeight > 0) {
                            if (mHeight > 100 - startTop) {
                                layout.height = 100 - startTop;
                            } else {
                                layout.height = mHeight;
                                scope.$emit('dragMoveS');
                            }
                        } else {
                            layout.height = 0;
                        }

                        //layout.height = mHeight > 0 ? mHeight : 0;
                    }

                    function drag_w(percentX) {
                        if (percentX === 0) {
                            return;
                        }
                        var layout = scope.ele.layout;
                        var mWidth = startWidth - percentX;
                        if (mWidth > 0) {
                            var nowLeft = startLeft + percentX;
                            if (nowLeft < 0) {
                                layout.left = 0;
                                layout.width = startWidth + startLeft;
                            } else {
                                layout.left = nowLeft;
                                layout.width = mWidth;
                                scope.$emit('dragMoveW');
                            }

                            //layout.left = startLeft + percentX;
                            //layout.width = mWidth;
                        } else {
                            layout.left = startLeft + startWidth;
                            layout.width = 0;
                        }
                    }

                    function drag_e(percentX) {
                        if (percentX === 0) {
                            return;
                        }
                        var layout = scope.ele.layout;
                        var mWidth = startWidth + percentX;
                        if (mWidth > 0) {
                            if (mWidth > 100 - startLeft) {
                                layout.width = 100 - startLeft;
                            } else {
                                layout.width = mWidth;
                                scope.$emit('dragMoveE');
                            }
                        } else {
                            layout.width = 0;
                        }

                        //layout.width = mWidth > 0 ? mWidth : 0;
                    }

                    function isFromDragger(e) {
                        var target = e.target;
                        return (target === this_dom
                            || target === dot_nw
                            || target === dot_n
                            || target === dot_ne
                            || target === dot_w
                            || target === dot_e
                            || target === dot_sw
                            || target === dot_s
                            || target === dot_se
                            || target === btn_close);
                    }

                    var mousedownFunc = function (e) {
                        if (isFromDragger(e)) {
                            e.stopPropagation();
                            var layout = scope.ele.layout;
                            if (e.button === 0 || e.which === 1) {//鼠标左键
                                isStart = true;
                                startX = e.pageX;
                                startY = e.pageY;
                                startLeft = layout.left;
                                startTop = layout.top;
                                startWidth = layout.width;
                                startHeight = layout.height;
                                cur_dot = e.target;

                                var startData = {
                                    startLeft: startLeft,
                                    startTop: startTop,
                                    startWidth: startWidth,
                                    startHeight: startHeight
                                };

                                if (cur_dot === this_dom) {//移动
                                    scope.$emit('dragStartX', startData);
                                    scope.$emit('dragStartY', startData);
                                } else if (cur_dot === dot_nw) {//左上
                                    scope.$emit('dragStartN', startData);
                                    scope.$emit('dragStartW', startData);
                                } else if (cur_dot === dot_n) {//上
                                    scope.$emit('dragStartN', startData);
                                } else if (cur_dot === dot_ne) {//右上
                                    scope.$emit('dragStartN', startData);
                                    scope.$emit('dragStartE', startData);
                                } else if (cur_dot === dot_w) {//左
                                    scope.$emit('dragStartW', startData);
                                } else if (cur_dot === dot_e) {//右
                                    scope.$emit('dragStartE', startData);
                                } else if (cur_dot === dot_sw) {//左下
                                    scope.$emit('dragStartW', startData);
                                    scope.$emit('dragStartS', startData);
                                } else if (cur_dot === dot_s) {//下
                                    scope.$emit('dragStartS', startData);
                                } else if (cur_dot === dot_se) {//右下
                                    scope.$emit('dragStartE', startData);
                                    scope.$emit('dragStartS', startData);
                                }
                            }
                        }
                    };

                    document.body.addEventListener('mousedown', mousedownFunc, false);

                    var mousemoveFunc = function (e) {
                        if (isFromDragger(e)) {
                            e.stopPropagation();
                        }
                        if (isStart && ((e.button === 0 || e.which === 1))) {
                            scope.$apply(function () {
                                var percentX = (e.pageX - startX) * 100 / scope.horizontalSize;
                                var percentY = (e.pageY - startY) * 100 / scope.verticalSize;

                                if (cur_dot === this_dom) {//移动
                                    move(percentX, percentY);
                                } else if (cur_dot === dot_nw) {//左上
                                    drag_w(percentX);
                                    drag_n(percentY);
                                } else if (cur_dot === dot_n) {//上
                                    drag_n(percentY);
                                } else if (cur_dot === dot_ne) {//右上
                                    drag_e(percentX);
                                    drag_n(percentY);
                                } else if (cur_dot === dot_w) {//左
                                    drag_w(percentX);
                                } else if (cur_dot === dot_e) {//右
                                    drag_e(percentX);
                                } else if (cur_dot === dot_sw) {//左下
                                    drag_w(percentX);
                                    drag_s(percentY);
                                } else if (cur_dot === dot_s) {//下
                                    drag_s(percentY);
                                } else if (cur_dot === dot_se) {//右下
                                    drag_e(percentX);
                                    drag_s(percentY);
                                }
                            });
                        }
                    };

                    document.body.addEventListener('mousemove', mousemoveFunc, false);

                    var mouseupFunc = function (e) {
                        if (isFromDragger(e)) {
                            e.stopPropagation();
                        }

                        if (isStart && ((e.button === 0 || e.which === 1))) {
                            var layout = scope.ele.layout;
                            var nowLeft = layout.left;
                            var nowTop = layout.top;
                            var nowWidth = layout.width;
                            var nowHeight = layout.height;

                            scope.$emit('dragEnd', function (horizontalPercent, verticalPercent) {
                                if (cur_dot === this_dom) {//移动
                                    if (horizontalPercent !== null) {
                                        nowTop = horizontalPercent;
                                    }
                                    if (verticalPercent !== null) {
                                        nowLeft = verticalPercent;
                                    }
                                } else if (cur_dot === dot_nw) {//左上
                                    if (horizontalPercent !== null) {
                                        nowTop = horizontalPercent;
                                        nowHeight = startTop + startHeight - horizontalPercent;
                                    }
                                    if (verticalPercent !== null) {
                                        nowLeft = verticalPercent;
                                        nowWidth = startLeft + startWidth - verticalPercent;
                                    }
                                } else if (cur_dot === dot_n) {//上
                                    if (horizontalPercent !== null) {
                                        nowTop = horizontalPercent;
                                        nowHeight = startTop + startHeight - horizontalPercent;
                                    }
                                } else if (cur_dot === dot_ne) {//右上
                                    if (horizontalPercent !== null) {
                                        nowTop = horizontalPercent;
                                        nowHeight = startTop + startHeight - horizontalPercent;
                                    }
                                    if (verticalPercent !== null) {
                                        nowWidth = verticalPercent - startLeft;
                                    }
                                } else if (cur_dot === dot_w) {//左
                                    if (verticalPercent !== null) {
                                        nowLeft = verticalPercent;
                                        nowWidth = startLeft + startWidth - verticalPercent;
                                    }
                                } else if (cur_dot === dot_e) {//右
                                    if (verticalPercent !== null) {
                                        nowWidth = verticalPercent - startLeft;
                                    }
                                } else if (cur_dot === dot_sw) {//左下
                                    if (verticalPercent !== null) {
                                        nowLeft = verticalPercent;
                                        nowWidth = startLeft + startWidth - verticalPercent;
                                    }
                                    if (horizontalPercent !== null) {
                                        nowHeight = horizontalPercent - startTop;
                                    }
                                } else if (cur_dot === dot_s) {//下
                                    if (horizontalPercent !== null) {
                                        nowHeight = horizontalPercent - startTop;
                                    }
                                } else if (cur_dot === dot_se) {//右下
                                    if (verticalPercent !== null) {
                                        nowWidth = verticalPercent - startLeft;
                                    }
                                    if (horizontalPercent !== null) {
                                        nowHeight = horizontalPercent - startTop;
                                    }
                                }

                                if (nowLeft !== startLeft
                                    || nowTop !== startTop
                                    || nowWidth !== startWidth
                                    || nowHeight !== startHeight) {

                                    var oldLeft = startLeft;
                                    var oldTop = startTop;
                                    var oldWidth = startWidth;
                                    var oldHeight = startHeight;
                                    scope.$apply(function () {
                                        editorRedoUndoService.saveAndExecRedo(function () {
                                            layout.left = nowLeft;
                                            layout.top = nowTop;
                                            layout.width = nowWidth;
                                            layout.height = nowHeight;
                                        }, function () {
                                            layout.left = oldLeft;
                                            layout.top = oldTop;
                                            layout.width = oldWidth;
                                            layout.height = oldHeight;
                                        }, scope);
                                    });
                                } else {//之前本身就与线对齐的情况下需要重置
                                    scope.$apply(function () {
                                        layout.left = nowLeft;
                                        layout.top = nowTop;
                                        layout.width = nowWidth;
                                        layout.height = nowHeight;
                                    });
                                }
                            });
                        }

                        isStart = false;
                        cur_dot = null;
                    };

                    document.body.addEventListener('mouseup', mouseupFunc, false);

                    //销毁时移除事件
                    scope.$on('$destroy', function () {
                        document.body.removeEventListener('mouseup', mouseupFunc, false);
                        document.body.removeEventListener('mousemove', mousemoveFunc, false);
                        document.body.removeEventListener('mousedown', mousedownFunc, false);
                    });
                })();

            }
        };
    }]);

};
