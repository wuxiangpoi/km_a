import {
    citiesNo
} from '../services/cityService'
import png64 from '../img/64-64.png'
export default app => {
    app.directive('emapChart', ['$window', 'baseService', '$rootScope', ($window, baseService, $rootScope) => {
        let controller = ($scope, element, attrs) => {
            $scope.hasDomains = $rootScope.userData.hasDomains;
            $scope.initPage = function () {
                var bmap = new BMap.Map("allmap",{enableMapClick:false});
                var point = new BMap.Point(113.649644, 34.75661);
                var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
                bmap.addControl(top_left_navigation);
                bmap.centerAndZoom(point, 5);
                bmap.enableScrollWheelZoom(true);
                var spanSma = this._span = document.createElement("span");
                var resMark = [];

                // let styleJson = [{
                //         "featureType": "water",
                //         "elementType": "all",
                //         "stylers": {
                //             "color": "#000000"
                //         }
                //     },
                //     {
                //         "featureType": "land",
                //         "elementType": "all",
                //         "stylers": {
                //             "color": "#0a2439"
                //         }
                //     },
                //     {
                //         "featureType": "boundary",
                //         "elementType": "geometry",
                //         "stylers": {
                //             "color": "#2d5f8c"
                //         }
                //     },
                //     {
                //         "featureType": "railway",
                //         "elementType": "all",
                //         "stylers": {
                //             "visibility": "on"
                //         }
                //     },
                //     {
                //         "featureType": "highway",
                //         "elementType": "geometry",
                //         "stylers": {
                //             "color": "#49122c"
                //         }
                //     },
                //     {
                //         "featureType": "highway",
                //         "elementType": "geometry.fill",
                //         "stylers": {
                //             "color": "#005b96",
                //             "lightness": 1
                //         }
                //     },
                //     {
                //         "featureType": "highway",
                //         "elementType": "labels",
                //         "stylers": {
                //             "visibility": "on"
                //         }
                //     },
                //     {
                //         "featureType": "arterial",
                //         "elementType": "geometry",
                //         "stylers": {
                //             "color": "red"
                //         }
                //     },
                //     {
                //         "featureType": "arterial",
                //         "elementType": "geometry.fill",
                //         "stylers": {
                //             "color": "#00508b"
                //         }
                //     },
                //     {
                //         "featureType": "poi",
                //         "elementType": "all",
                //         "stylers": {
                //             "visibility": "off"
                //         }
                //     },
                //     {
                //         "featureType": "green",
                //         "elementType": "all",
                //         "stylers": {
                //             "color": "#056197",
                //             "visibility": "on"
                //         }
                //     },
                //     {
                //         "featureType": "subway",
                //         "elementType": "all",
                //         "stylers": {
                //             "visibility": "on"
                //         }
                //     },
                //     {
                //         "featureType": "manmade",
                //         "elementType": "all",
                //         "stylers": {
                //             "visibility": "on"
                //         }
                //     },
                //     {
                //         "featureType": "local",
                //         "elementType": "all",
                //         "stylers": {
                //             "visibility": "on"
                //         }
                //     },
                //     {
                //         "featureType": "arterial",
                //         "elementType": "labels",
                //         "stylers": {
                //             "visibility": "on"
                //         }
                //     },
                //     {
                //         "featureType": "boundary",
                //         "elementType": "geometry.fill",
                //         "stylers": {
                //             "color": "#2d5f8c"
                //         }
                //     },
                //     {
                //         "featureType": "building",
                //         "elementType": "all",
                //         "stylers": {
                //             "color": "#red"
                //         }
                //     },
                //     {
                //         "featureType": "label",
                //         "elementType": "labels.text.fill",
                //         "stylers": {
                //             "color": "#3d8eab",
                //             "visibility": "on"
                //         }
                //     },
                //     {
                //         "featureType": "label",
                //         "elementType": "labels.text.stroke",
                //         "stylers": {
                //             "color": "#444444",
                //             "visibility": "on"
                //         }
                //     },
                //     {
                //         "featureType": "district",
                //         "elementType": "labels.text.fill",
                //         "stylers": {
                //             "color": "#ff0000ff"
                //         }
                //     },
                //     {
                //         "featureType": "town",
                //         "elementType": "labels.text.fill",
                //         "stylers": {
                //             "color": "#ff0000ff"
                //         }
                //     }
                // ]
                bmap.setMapStyle({
                    style: 'midnight'
                });

                function ComplexCustomOverlay(point, index, value, scal, children, oData) {
                    this._point = point;
                    this._index = index;
                    this._value = value;
                    this._scal = scal;
                    this._children = children;
                    this._oData = oData;
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
                        'padding': '5px',
                        'background': `url(${png64}) no-repeat`,
                        'background-size': '50px 50px',
                        'text-align': 'center',
                        'font-size': '12px',
                        'point-events': 'none',
                        'cursor': 'pointer'
                    });　　 //设置数字也就是我们的标注
                    // $(span).addClass('cl')
                    $(spanVlu).css({
                        'display': 'block'
                    })
                    spanVlu.innerHTML = this._value;
                    spanNum.innerHTML = this._index;
                    this._span.insertBefore(spanVlu, this._span.childNodes[0]);
                    this._span.appendChild(spanNum);
                    bmap.getPanes().labelPane.appendChild(span);

                    var pt = new BMap.Point(this._point.lng, this._point.lat);
                    var scal = this._scal;
                    var children = this._children;
                    var oData = this._oData;
                    $(span).on('click', function () {
                        bmap.centerAndZoom(pt, scal);
                        $(span).hide();
                        // 覆盖物构造方法
                        function smallComplexCustomOverlay(point, index) {
                            this._point = point;
                            //._index = index;
                        }
                        smallComplexCustomOverlay.prototype = new BMap.Overlay();
                        smallComplexCustomOverlay.prototype.initialize = function (bmap) {
                            this._map = bmap;
                            var spanSma = this._span = document.createElement("span");
                            $(spanSma).css({
                                'position': 'absolute',
                                'zIndex': BMap.Overlay.getZIndex(this._point.lat),
                                'display': 'block',
                                'color': '#FFF',
                                'width': '20px',
                                'height': '42px',
                                'line-height': '26px',
                                'background': 'url("http://api0.map.bdimg.com/images/marker_red_sprite.png") no-repeat 0 14px',
                                'text-align': 'center',
                                'font-size': '12px',
                                'point-events': 'none',
                                'cursor': 'pointer'
                            });　　
                            $(spanSma).addClass('sma')
                            //this._span.innerHTML = this._index;
                            bmap.getPanes().labelPane.appendChild(spanSma);
                            let oPoint = [this._point.lng, this._point.lat].join(',');

                            function addClickHandler(content, marker, oPoint) {
                                marker.addEventListener("click", function () {
                                    openInfo(content,oPoint)
                                });
                            }

                            function openInfo(content, oPoint) {
                                var point = new BMap.Point(oPoint.split(',')[0], oPoint.split(',')[1]);
                                var infoWindow = new BMap.InfoWindow(content,{
                                    width: 250, // 信息窗口宽度
                                    title: "终端信息",
                                    padding: 5
                                }); // 创建信息窗口对象 
                                bmap.openInfoWindow(infoWindow, point); //开启信息窗口
                            }
                            var content = [];
                            for (var j = 0; j < oData[oPoint].length; j++) {
                                var ter = oData[oPoint][j];
                                
                                content.push("<h5 style='margin:5px 0;'>地址：" + oData[oPoint][0].addr + "</h5>");
                                
                                content.push('<div class="infoWindow" style="border-top:1px solid #ddd;font-size:12px;line-height:18px;padding-top:5px;">')
                                content.push('<div class="info-line"></div>编号：' + ter.no);
                                content.push("<div>名称：" + ter.name + "</div>");

                                if (ter.status == 0) {
                                    content.push("<div>状态：未激活</div>");

                                } else if (ter.status == 1) {
                                    content.push("<div>状态：在线</div>");
                                } else if (ter.status == 2) {
                                    content.push("<div>状态：离线</div>");

                                } else if (ter.status == 3) {
                                    content.push("<div>状态：异常</div>");
                                }
                                content.push('</div>')
                                
                            }
                            addClickHandler(content.join(''), spanSma,oPoint);
                            return spanSma;
                        }


                        smallComplexCustomOverlay.prototype.draw = function () {
                            var map = this._map;
                            var pixel = bmap.pointToOverlayPixel(this._point);　　 //设置自定义覆盖物span 与marker的位置
                            this._span.style.left = pixel.x - 11 + 'px';
                            this._span.style.top = pixel.y - 28 + 'px';
                        }
                        for (let k = 0; k < children.length; k++) {
                            var point = new BMap.Point(children[k].p.y, children[k].p.x);
                            var marker = new BMap.Marker(point);
                            var myCompOverlay = new smallComplexCustomOverlay(point);

                            bmap.addOverlay(myCompOverlay);


                        }
                        // }
                        // else {
                        //     bmap.getPanes().labelPane.appendChild(span);
                        //     $('.sma').remove();
                        // }

                        // });
                    })
                    // bmap.addEventListener("click", function () {

                    //     // if(this.getZoom() > 7){   

                    //     // baseService.getData(baseService.api.apiUrl + '/api/report/allTerminalForMap', {}, function (res) {
                    //     //var terminalist = [];
                    //     // ************************************自定义覆盖物**************************************************************

                    // });
                    bmap.addEventListener("zoomend", function () {
                        if (this.getZoom() < 12) {
                            // bmap.getPanes().labelPane.appendChild(span);
                            $(span).show()
                            $('.sma').remove();
                            bmap.closeInfoWindow();
                        }
                        // else {

                        //     $(span).remove();
                        //     var smaMark = resMark;
                        //     var terminalist = [];
                        //             // ************************************自定义覆盖物**************************************************************
                        //             // 覆盖物构造方法
                        //             function ComplexCustomOverlay(point, index) {
                        //                 this._point = point;
                        //                 this._index = index;
                        //             }
                        //             ComplexCustomOverlay.prototype = new BMap.Overlay();
                        //             ComplexCustomOverlay.prototype.initialize = function (bmap) {
                        //                 this._map = bmap;
                        //                 var spanSma = this._span = document.createElement("span");
                        //                 $(spanSma).css({
                        //                     'position': 'absolute',
                        //                     'zIndex': BMap.Overlay.getZIndex(this._point.lat),
                        //                     'display': 'block',
                        //                     'color': '#FFF',
                        //                     'width': '20px',
                        //                     'height': '28px',
                        //                     'line-height': '26px',
                        //                     'background': 'url("http://api0.map.bdimg.com/images/marker_red_sprite.png") no-repeat',
                        //                     'text-align': 'center',
                        //                     'font-size': '12px',
                        //                     'point-events': 'none'
                        //                 });
                        //                 $(spanSma).addClass('sma');　　
                        //                 this._span.innerHTML = this._index;
                        //                 bmap.getPanes().labelPane.appendChild(spanSma);

                        //                 return spanSma;
                        //             }


                        //             ComplexCustomOverlay.prototype.draw = function () {
                        //                 var map = this._map;
                        //                 var pixel = bmap.pointToOverlayPixel(this._point);　　 //设置自定义覆盖物span 与marker的位置
                        //                 this._span.style.left = pixel.x - 11 + 'px';
                        //                 this._span.style.top = pixel.y - 28 + 'px';
                        //             }
                        //             for (var k in smaMark) {
                        //                 var point = new BMap.Point(k.split(',')[0], k.split(',')[1]);
                        //                 var marker = new BMap.Marker(point);
                        //                 var myCompOverlay = new ComplexCustomOverlay(point, smaMark[k].length);
                        //                 bmap.addOverlay(myCompOverlay);
                        //             }
                        // }
                    });


                    return span;
                }

                ComplexCustomOverlay.prototype.draw = function () {
                    var map = this._map;
                    var pixel = bmap.pointToOverlayPixel(this._point);　　 //设置自定义覆盖物span 与marker的位置
                    this._span.style.left = pixel.x - 11 + 'px';
                    this._span.style.top = pixel.y - 28 + 'px';
                }
                let mapJson = {};
                let mapUrl = '';
                if (!$scope.hasDomains) {
                    mapUrl = '/api/report/allTerminalForMap';
                } else {
                    mapUrl = '/api/terminal/getTerminalAllForMap';
                }
                baseService.getData(baseService.api.apiUrl + mapUrl, {}, function (res) {
                    let resCon;
                    if (!$scope.hasDomains) {
                        resCon = res.content;
                    } else {
                        resCon = res;
                    }
                    for (let i in resCon) {
                        for (let j = 0; j < resCon[i].length; j++) {
                            if (mapJson[resCon[i][j].city_no]) {
                                mapJson[resCon[i][j].city_no].push(resCon[i][j]);
                            } else {
                                mapJson[resCon[i][j].city_no] = [];
                                mapJson[resCon[i][j].city_no].push(resCon[i][j]);
                            }
                        }
                    }
                    for (let i in mapJson) {
                        let x = citiesNo[i].p.split(',')[0];
                        let y = citiesNo[i].p.split(',')[1].split('|')[0];
                        let scal = citiesNo[i].p.split(',')[1].split('|')[1];
                        var point = new BMap.Point(x, y);

                        var marker = new BMap.Marker(point);
                        let myCompOverlay = new ComplexCustomOverlay(point, mapJson[i].length, citiesNo[i].n, scal, mapJson[i], resCon);
                        bmap.addOverlay(myCompOverlay);
                    }
                });



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