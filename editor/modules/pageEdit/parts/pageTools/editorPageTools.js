var max = require('../../../../../libs/array').max;

var tplHtml = require('./editorPageTools.html');

var less = require('./editorPageTools.less');

module.exports = function (app) {

    //元素属性编辑模块
    app.directive('editorPageTools', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                page: '='
            },
            controller: ['$scope', function ($scope) {

                function doSomething(ele) {
                    var ext = {
                        "background": {
                            "ver": 1,
                            "type": 0,
                            "image": null,
                            "color": {
                                "r": 255,
                                "g": 255,
                                "b": 255
                            },
                            "opacity": 100
                        },
                        "border": {
                            "ver": 1,
                            "color": {
                                "r": 0,
                                "g": 160,
                                "b": 233
                            },
                            "width": 0,
                            "style": "solid",
                            "radius": 0,
                            "padding": 0,
                            "opacity": 100
                        },
                        "filter": {
                            "ver": 1,
                            "opacity": 100,
                            "brightness": 100,
                            "saturate": 100,
                            "contrast": 100,
                            "grayscale": 0,
                            "blur": 0,
                            "invert": 0,
                            "hueRotate": 0
                        }
                    };

                    angular.extend(ele, ext);
                    $scope.$emit('editor-element-add', ele);
                }

                function computeZIndex() {
                    var allLayouts = $scope.page.elements.map(function (ele) {
                        return ele.layout;
                    });
                    if (allLayouts.length === 0) {
                        return 0;
                    }
                    var maxLayout = max(allLayouts, function (layout) {
                        return layout.zIndex;
                    });
                    return maxLayout.zIndex + 1;
                }

                //设为文本类型
                $scope.setTextElement = function () {
                    var width = 80;
                    var height = 8 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 100,
                        "data": {
                            "ver": 1,
                            "isMultiple": false,
                            "value": "快媒数字",
                            "font": 0,
                            "size": 25,
                            "color": {
                                "r": 0,
                                "g": 160,
                                "b": 233
                            },
                            "horizontalAlign": "center",
                            "verticalAlign": "middle"
                        },
                        "layout": {
                            "ver": 1,
                            "left": 10,
                            "top": 50,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为文本走马灯
                $scope.setTextMarqueeElement = function () {
                    var width = 80;
                    var height = 8 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 160,
                        "data": {
                            "ver": 1,
                            "isScroll": true,
                            "speed": 10,
                            "value": "快媒数字，引领媒体新潮流",
                            "font": 0,
                            "size": 30,
                            "color": {
                                "r": 51,
                                "g": 51,
                                "b": 51
                            },
                            "horizontalAlign": "center",
                            "verticalAlign": "middle"
                        },
                        "layout": {
                            "ver": 1,
                            "left": 10,
                            "top": 50,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为跑马灯类型
                $scope.setMarqueeElement = function () {
                    var width = 80;
                    var height = 8 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 150,
                        "data": {
                            "ver": 1,
                            "value": "快媒数字，引领媒体新潮流",
                            "font": 0,
                            "size": 25,
                            "color": {
                                "r": 0,
                                "g": 160,
                                "b": 233
                            },
                            "verticalAlign": "middle",
                            "speed": 10,
                            "isLeft": true
                        },
                        "layout": {
                            "ver": 1,
                            "left": 10,
                            "top": 50,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为图片类型
                $scope.setImageElement = function () {
                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 200,
                        "data": {
                            "ver": 1,
                            "image": null
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为轮播类型
                $scope.setImagesElement = function () {
                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 250,
                        "data": {
                            "ver": 1,
                            "images": [],
                            "disableAnimation": false,
                            "animation": {
                                "inId": 1,
                                "outId": 1
                            },
                            "stay": 5,
                            "duration": 500
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为单视频类型
                $scope.setVideoElement = function () {
                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 300,
                        "data": {
                            "ver": 1,
                            "video": null,
                            "isMuted": false
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为多视频类型
                $scope.setVideosElement = function () {
                    if ($scope.page.elements.filter(function (item) {
                            return item.type === 350;
                        }).length >= 5) {
                        layer.msg('视频数量不能超过 5 个！');
                        return;
                    }

                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 350,
                        "data": {
                            "ver": 1,
                            "videos": [],
                            "isMuted": false
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为单音乐类型
                $scope.setMusicElement = function () {

                };

                //设为多音乐类型
                $scope.setMusicsElement = function () {

                };

                //设为时间类型
                $scope.setTimeElement = function () {
                    var width = 80;
                    var height = 8 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 500,
                        "data": {
                            "ver": 1,
                            "formatter": 4,
                            "font": 0,
                            "size": 30,
                            "color": {
                                "r": 51,
                                "g": 51,
                                "b": 51
                            },
                            "horizontalAlign": "right",
                            "verticalAlign": "middle"
                        },
                        "layout": {
                            "ver": 1,
                            "left": 10,
                            "top": 50,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为天气类型
                $scope.setWeatherElement = function () {

                };

                //设为地图类型
                $scope.setMapElement = function () {

                };

                //设为RSS类型
                $scope.setRSSElement = function () {

                };

                //设为网页类型
                $scope.setWebviewElement = function () {
                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 900,
                        "data": {
                            "ver": 1,
                            "url": "",
                            "autoRefresh": false,
                            "refreshInterval": 60
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //添加流媒体
                $scope.setStreamMediaElement = function () {
                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 1000,
                        "data": {
                            "ver": 1,
                            "url": ""
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //添加摄像头
                $scope.setCameraElement = function () {
                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 1100,
                        "data": {
                            "ver": 1,
                            "brand": 1,
                            "ip": "",
                            "port": 554,
                            "account": "",
                            "password": "",
                            "code": 0,
                            "channel": 1
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

            }]
        };
    });

};
