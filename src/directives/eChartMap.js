import {citiesNo } from '../services/cityService'
import png64 from '../img/64-64.png'
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
                baseService.getData(baseService.api.report + 'terminalReportByRegion', {}, function (res) {
                    //*****************/
            
                    // ************************************自定义覆盖物**************************************************************
                    // 覆盖物构造方法
                    function ComplexCustomOverlay(point, index,value) {
                        this._point = point;
                        this._index = index;
                        this._value = value;
                    }
                    ComplexCustomOverlay.prototype = new BMap.Overlay();
                    ComplexCustomOverlay.prototype.initialize = function (bmap) {
                        this._map = bmap;
                        var span = this._span = document.createElement("span");
                        var spanNum = document.createElement("span");
                        var spanVlu = document.createElement("span");
                        $(span).css({
                            'position': 'absolute',
                            'zIndex': BMap.Overlay.getZIndex(this._point.lat),
                            'display': 'block',
                            'color': '#FFF',
                            'width': '50px',
                            'height': '50px',
                            'padding':'5px',
                            'background': `url(${png64}) no-repeat`,
                            'background-size':'50px 50px',
                            'text-align': 'center',
                            'font-size': '12px',
                            'point-events': 'none'
                        });　　 //设置数字也就是我们的标注
                        
                        $(spanVlu).css({
                            'display':'block'
                        })
                        spanVlu.innerHTML = this._value;
                        spanNum.innerHTML = this._index;
                        this._span.insertBefore(spanVlu,this._span.childNodes[0]);
                        this._span.appendChild(spanNum);
                        bmap.getPanes().labelPane.appendChild(span);

                        return span;
                    }

                    ComplexCustomOverlay.prototype.draw = function () {
                        var map = this._map;
                        var pixel = bmap.pointToOverlayPixel(this._point);　　 //设置自定义覆盖物span 与marker的位置
                        this._span.style.left = pixel.x - 11 + 'px';
                        this._span.style.top = pixel.y - 28 + 'px';
                    }
                    var data = [];
	
		            for (var i = 0; i < res.length; i++) {
		            	data.push({
		            		name: citiesNo[res[i].cityCode].n,
		            		value: res[i].count
		            	})
		            
		            }

                    for (var i = 0; i < res.length; i++) {
                        let x = citiesNo[res[i].cityCode].p.split(',')[0];
                        let y = citiesNo[res[i].cityCode].p.split(',')[1].split('|')[0];
                      
                        var point = new BMap.Point(x, y);
                        var marker = new BMap.Marker(point);
                        let myCompOverlay = new ComplexCustomOverlay(point,res[i].count,citiesNo[res[i].cityCode].n);

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