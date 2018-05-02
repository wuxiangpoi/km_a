import echarts from '../libs/chart/echarts.min.js'
// import'../libs/chart/bmap.min.js'

export default app => {
    app.directive('emapChart', ['$window', 'baseService', ($window, baseService) => {
        let controller = ($scope, element, attrs) => {

            var myChart = echarts.init(element[0]);
            $scope.getMapData = () => {
                var bmap = new BMap.Map($(element[0]).attr('id'));
                baseService.getData(baseService.api.report + 'allTerminalForMap', {}, function (res) {
                    var terminalist = [];
                    // ************************************自定义覆盖物**************************************************************
                    // 覆盖物构造方法
                    function ComplexCustomOverlay(point, index) {
                        this._point = point;
                        this._index = index;
                    }
                    ComplexCustomOverlay.prototype = new BMap.Overlay();
                    ComplexCustomOverlay.prototype.initialize = function (bmap) {
                        this._map = bmap;
                        var span = this._span = document.createElement("span");
                        $(span).css({
                            'position': 'absolute',
                            'zIndex': BMap.Overlay.getZIndex(this._point.lat),
                            'display': 'block',
                            'color': '#FFF',
                            'width': '20px',
                            'height': '28px',
                            'line-height': '26px',
                            'background': 'url("http://api0.map.bdimg.com/images/marker_red_sprite.png") no-repeat',
                            'text-align': 'center',
                            'font-size': '12px',
                            'point-events': 'none'
                        });　　 //设置数字也就是我们的标注
                        this._span.innerHTML = this._index;
                        bmap.getPanes().labelPane.appendChild(span);

                        return span;
                    }

                    ComplexCustomOverlay.prototype.draw = function () {
                        var map = this._map;
                        var pixel = bmap.pointToOverlayPixel(this._point);　　 //设置自定义覆盖物span 与marker的位置
                        this._span.style.left = pixel.x - 11 + 'px';
                        this._span.style.top = pixel.y - 28 + 'px';
                    }
                    for (var k in res.content) {
                        var point = new BMap.Point(k.split(',')[0], k.split(',')[1]);
                        var marker = new BMap.Marker(point);
                        if (res.content[k].length > 1) {
                            var myCompOverlay = new ComplexCustomOverlay(point, res.content[k].length);
                        } else {
                            var myCompOverlay = new ComplexCustomOverlay(point, '');
                        }
                        bmap.addOverlay(myCompOverlay);
                    }

                })
            }
            attrs.$observe('mapData', function () { //通过$observe监听attrs中绑定的option属性，可以通过ajax请求数据，动态更新图表。


                if (typeof (BMap) == 'undefined') {
                    var script = document.createElement("script");
                    script.src = "http://api.map.baidu.com/api?v=2.0&ak=hWot28fmyYXe1AMOfBfHoMMfSlnVnkeb&callback=baiduMapLoaded";
                    document.body.appendChild(script);
                    $window.baiduMapLoaded = function () {
                        $scope.getMapData();
                    }
                } else {
                    $scope.getMapData();
                }
            }, true);
        }
        return {
            restrict: 'AE',
            scope: {
                source: '='
            },
            link: controller
        };
    }])
};