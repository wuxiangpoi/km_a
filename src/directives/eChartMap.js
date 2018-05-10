export default app => {
    app.directive('emapChart', ['$window', 'baseService', ($window, baseService) => {
        let controller = ($scope, element, attrs) => {
            $scope.initPage = function () {
                var bmap = new BMap.Map("allmap");
                var point = new BMap.Point(113.649644, 34.75661);
                bmap.centerAndZoom(point, 5);
                bmap.enableScrollWheelZoom(true);
                let styleJson = [{
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": {
                            "color": "#000000"
                        }
                    },
                    {
                        "featureType": "land",
                        "elementType": "all",
                        "stylers": {
                            "color": "#0a2439"
                        }
                    },
                    {
                        "featureType": "boundary",
                        "elementType": "geometry",
                        "stylers": {
                            "color": "#2d5f8c"
                        }
                    },
                    {
                        "featureType": "railway",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "highway",
                        "elementType": "geometry",
                        "stylers": {
                            "color": "#49122c"
                        }
                    },
                    {
                        "featureType": "highway",
                        "elementType": "geometry.fill",
                        "stylers": {
                            "color": "#005b96",
                            "lightness": 1
                        }
                    },
                    {
                        "featureType": "highway",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "arterial",
                        "elementType": "geometry",
                        "stylers": {
                            "color": "red"
                        }
                    },
                    {
                        "featureType": "arterial",
                        "elementType": "geometry.fill",
                        "stylers": {
                            "color": "#00508b"
                        }
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "green",
                        "elementType": "all",
                        "stylers": {
                            "color": "#056197",
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "subway",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "manmade",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "local",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "arterial",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "boundary",
                        "elementType": "geometry.fill",
                        "stylers": {
                            "color": "#2d5f8c"
                        }
                    },
                    {
                        "featureType": "building",
                        "elementType": "all",
                        "stylers": {
                            "color": "#red"
                        }
                    },
                    {
                        "featureType": "label",
                        "elementType": "labels.text.fill",
                        "stylers": {
                            "color": "#3d8eab",
                            "visibility": "on"
                        }
                    },
                    {
                        "featureType": "label",
                        "elementType": "labels.text.stroke",
                        "stylers": {
                            "color": "#444444",
                            "visibility": "on"
                        }
                    }
                ]
                bmap.setMapStyle({
                    styleJson: styleJson
                });
                baseService.getData(baseService.api.apiUrl + '/api/report/allTerminalForMap', {}, function (res) {
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
            if (typeof (BMap) == 'undefined') {
                var script = document.createElement("script");
                script.src = "http://api.map.baidu.com/api?v=2.0&ak=hWot28fmyYXe1AMOfBfHoMMfSlnVnkeb&callback=baiduMapLoaded";
                document.body.appendChild(script);
                $window.baiduMapLoaded = function () {
                    $scope.initPage();
                }
            } else {
                $scope.initPage();
            }
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