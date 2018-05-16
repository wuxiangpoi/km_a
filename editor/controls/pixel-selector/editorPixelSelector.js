import {find, remove} from '../../../libs/array';

var tplHtml = require('./editorPixelSelector.html');

module.exports = function (app) {

    app.directive('editorPixelSelector', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                onChange: '&',
                onCustom: '&'
            },
            controller: ['$scope', function ($scope) {

                function getCustomPixels() {
                    var pixels = [];
                    var str_customPixels = window.localStorage.getItem('customPixels');
                    if (str_customPixels) {
                        try {
                            var arr = JSON.parse(str_customPixels);
                            arr.forEach(function (value) {
                                pixels.push({h: value.h, v: value.v});
                            });
                        } catch (err) {

                        }
                    }
                    return pixels;
                }

                function addCustomPixel(ph, pv) {
                    var pixels = getCustomPixels();
                    pixels.push({h: ph, v: pv});
                    var str_customPixels = JSON.stringify(pixels);
                    try {
                        window.localStorage.setItem('customPixels', str_customPixels);
                    } catch (err) {

                    }
                }

                function delCustomPixel(ph, pv) {
                    var pixels = getCustomPixels();
                    var pixel = find(pixels, function (item) {
                        return item.h === ph && item.v === pv;
                    });
                    if (pixel) {
                        remove(pixels, pixel);
                    }
                    var str_customPixels = JSON.stringify(pixels);
                    try {
                        window.localStorage.setItem('customPixels', str_customPixels);
                    } catch (err) {

                    }
                }

                var internalPixels = [
                    {h: 1920, v: 1080},
                    {h: 1080, v: 1920},
                    {h: 1366, v: 768},
                    {h: 768, v: 1366},
                    {h: 1024, v: 768},
                    {h: 768, v: 1024}
                ];

                var customPixels = getCustomPixels();
                if (customPixels.every(function (value) {
                        return value.h !== $scope.pixelHorizontal || value.v !== $scope.pixelVertical;
                    })) {
                    customPixels.push({h: $scope.pixelHorizontal, v: $scope.pixelVertical});
                }

                var allPixels = [];
                internalPixels.forEach(function (value) {
                    allPixels.push({isCustom: false, h: value.h, v: value.v});
                });
                customPixels.forEach(function (value) {
                    if (internalPixels.every(function (item) {
                            return item.h !== value.h || item.v !== value.v;
                        })) {
                        allPixels.push({isCustom: true, h: value.h, v: value.v});
                    }
                });


                //控件展开状态
                $scope.isSpread = false;

                $scope.spreadChange = function ($event) {
                    $event.stopPropagation();
                    $scope.isSpread = !$scope.isSpread;
                };

                //可选的分辨率
                $scope.pixels = allPixels;

                //切换已有分辨率时
                $scope.changeItem = function (pixel) {
                    if ($scope.pixelHorizontal !== pixel.h || $scope.pixelVertical !== pixel.v) {
                        $scope.pixelHorizontal = pixel.h;
                        $scope.pixelVertical = pixel.v;
                        if ($scope.onChange) {
                            $scope.onChange({
                                ph: pixel.h,
                                pv: pixel.v
                            });
                        }
                    }
                };

                //删除自定义分辨率
                $scope.deleteItem = function (pixel, $event) {
                    $event.stopPropagation();

                    //持久化中移除
                    delCustomPixel(pixel.h, pixel.v);

                    //内存中移除
                    var fPixel = find(allPixels, function (item) {
                        return item.h === pixel.h && item.v === pixel.v;
                    });
                    if (fPixel) {
                        remove(allPixels, fPixel);
                    }
                };

                $scope.onCustomClick = function () {
                    $scope.onCustom({
                        ph: $scope.pixelHorizontal,
                        pv: $scope.pixelVertical,
                        callback: function (ph, pv) {
                            $scope.pixelHorizontal = ph;
                            $scope.pixelVertical = pv;
                            if (allPixels.every(function (value) {
                                    return value.h !== ph || value.v !== pv;
                                })) {
                                //持久化中添加
                                addCustomPixel(ph, pv);
                                //内存中添加
                                allPixels.push({isCustom: true, h: ph, v: pv});
                            }
                        }
                    });
                };

                //关闭展开状态
                function closeSpread() {
                    $scope.$apply(function () {
                        $scope.isSpread = false;
                    });
                }

                document.addEventListener('click', closeSpread, false);
                //销毁时移除事件
                $scope.$on('$destroy', function () {
                    document.removeEventListener('click', closeSpread, false);
                });
            }]
        };
    });

};
