import hex_md5 from '../libs/md5.js'
import confirmTpl from '../tpl/confirm.tpl.html'
import confirmDialogTpl from '../tpl/confirm_dialog.tpl.html'

export default app => {
    app.factory('baseService', ['$rootScope', '$http', '$state', 'ngDialog', '$modal', '$alert', ($rootScope, $http, $state, ngDialog, $modal, $alert) => {
        let apiUrl = 'http://47.92.116.16:7070';
        let verson = '?_v1.51';
        let baseService = {
            api: {
                apiUrl: apiUrl,
                auth: apiUrl + '/api/auth/',
                admin: apiUrl + '/api/admin/',
                led: apiUrl + '/api/led/',
                ledPage: apiUrl + '/api/ledPage/',
                material: apiUrl + '/api/material/',
                terminal: apiUrl + '/api/terminal/',
                terminalCommandSend: apiUrl + '/api/terminalCommandSend/',
                terminalCommandDomain: apiUrl + '/api/terminalCommandDomain/',
                program: apiUrl + '/api/program/',
                programSchedule: apiUrl + '/api/programSchedule/',
                aUser: apiUrl + '/api/auser/',
                dictionary: apiUrl + '/api/dictionary/',
                domain: apiUrl + '/api/domain/',
                admin: apiUrl + '/api/admin/',
                versionFile: apiUrl + '/api/versionFile/',
                checkModel: apiUrl + '/api/checkModel/'
            },
            md5_pwd(pwd) {
                var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7',
                    '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
                ];
                var enStr = hex_md5(pwd + "dmbd!@#$%^&*");
                var str = '';
                for (var i = 0; i < enStr.length; i++) {
                    for (var j = 0; j < hexDigits.length; j++) {
                        if (hexDigits[j] == enStr.charAt(i)) {
                            j = j + 1;
                            str += hexDigits[j == hexDigits.length ? 0 : j];
                        }
                    }
                }
                return str;

            },
            goToState(state,params) {
                $state.go(state,params)
            },
            isRealNum: function (val) {
                // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
                if (val === "" || val == null) {
                    return false;
                }
                if (!isNaN(val)) {
                    return true;
                } else {
                    return false;
                }
            },
            alert: function (info, type) {
                $alert({
                    content: info,
                    placement: 'top',
                    type: type,
                    show: true,
                    duration: 2
                });
            },
            confirm: function (title, info, posting, cb) {
                $modal({
                    template: confirmTpl,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: true,
                    show: true,
                    controller($scope) {
                        $scope.title = title;
                        $scope.info = info;
                        $scope.isPosting = !posting;
                        $scope.confirm = () => {
                            $scope.isPosting = posting;
                            cb($scope);
                        }
                    }
                });
            },
            confirmDialog: function (title, data, html, cb, beforeOpen) {
                this.beforeOpen = beforeOpen || 0
                $modal({
                    template: confirmDialogTpl,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    show: true,
                    backdrop: true,
                    controller($scope,$window, $compile) {
                        $scope.title = title;
                        $scope.data = data;
                        $scope.html = html;
                        if(beforeOpen){
                            beforeOpen($scope);
                        }
                        $scope.confirm = () => {
                            cb($scope);
                        }
                    }
                });
            },
            getJson: function (url, params, cb) {
                var me = this;
                $http.post(url, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                }).then(function (res) {
                    var data = res.data;
                    if (data.code == 1) {
                        cb(data.content);
                    } else if (data.code == 2) {
                        me.goToState('login');
                        return false;
                    } else {
                        me.alert(data.message, 'warning');
                        return false;
                    }
                }, function (res) {
                    me.alert('网络或服务端异常', 'warning')
                })
            },
            getData: function (url, params, cb) {
                var me = this;
                $http.get(url, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                }).then(function (res) {
                    var data = res.data;
                    if (data.code == 1) {
                        cb(data.content);
                    } else if (data.code == 2) {
                        me.goToState('login');
                        return false;
                    } else {
                        me.alert(data.message, 'warning');
                        return false;
                    }
                }, function (res) {
                    me.alert('网络或服务端异常', 'warning')
                })
            },
            postData: function (url, params, cb) {
                var me = this;
                $http.post(url, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                }).then(function (res) {
                    var data = res.data;
                    if (data.code == 1) {
                        cb(data.content);
                    } else if (data.code == 2) {
                        me.goToState('login');
                        // return false;
                    } else {
                        me.alert(data.message, 'warning');
                        return false;
                    }
                }, function (res) {
                    me.alert('网络或服务端异常', 'warning')
                })
            },
            dmbdOSSImageUrlResizeFilter: function (imgUrl, size) {
                var joinChar = imgUrl.indexOf('?') >= 0 ? '&' : '?';
                return imgUrl + joinChar + 'x-oss-process=image/resize,m_lfit,h_' + size + ',w_' + size;
            },
            removeAry: function (aObj, val) {
                var nArr = [];
                for (var i = 0; i < aObj.length; i++) {
                    if (aObj[i] != val) {
                        nArr.push(aObj[i]);
                    }
                }
                return nArr;
            },
            goToUrl: function (path) {
                $location.path = '/dashboard';
            },
            initTable: function ($scope, tableState, url,cb) {
                $scope.isLoading = true;
                $scope.tableState = tableState;
                var pagination = tableState.pagination;
                
                var start = pagination.start || 0;
                var num = $scope.sp.length;
                $scope.sp.start = start;
                this.getJson(url, $scope.sp, function (result) {
                    $scope.displayed = result.data;
                    num = num || $rootScope.paginationNumber[0];
                    tableState.pagination.number = num;
                    tableState.pagination.totalItemCount = result.recordsTotal;
                    tableState.pagination.numberOfPages = Math.ceil(result.recordsTotal / num);
                    $scope.isLoading = false;
                    if (cb) {
                        cb(result);
                    }
                })
            },
            formateDay: function (day) {
                if (day < 10) {
                    return '0' + day.toString();
                } else {
                    return day.toString();
                }
            },
            getPerms: function (cb) {
                this.postData(this.api.admin + 'getPermsList', {}, function (data) {
                    cb(data);
                })
            },
            getMonthTxt: function (month) {
                switch (month) {
                    case 1:
                        return '一月'
                        break;
                    case 2:
                        return '二月'
                        break;
                    case 3:
                        return '三月'
                        break;
                    case 4:
                        return '四月'
                        break;
                    case 5:
                        return '五月'
                        break;
                    case 6:
                        return '六月'
                        break;
                    case 7:
                        return '七月'
                        break;
                    case 8:
                        return '八月'
                        break;
                    case 9:
                        return '九月'
                        break;
                    case 10:
                        return '十月'
                        break;
                    case 11:
                        return '十一月'
                        break;
                    case 12:
                        return '十二月'
                        break;
                }
            },
            formateDay: function (day) {
                if (day < 10) {
                    return '0' + day.toString();
                } else {
                    return day.toString();
                }
            },
            formateDayTime: function (date) {
                return Date.parse(date.substring(0, 4) + '/' + date.substring(4, 6) + '/' + date.substring(6, 8));
            },
            formateDayTxt: function (date) {
                return date.substring(0, 4) + '年' + date.substring(4, 6) + '月' + date.substring(6, 8) + '日';
            },
            getFirstorLastDay: function getLastDay(date, type) {
                var now = new Date(date);
                var year = now.getFullYear();
                var month = now.getMonth();
                var ft = new Date(year, month - 1, '01');
                ft.setDate(1);
                ft.setMonth(ft.getMonth() + 1);
                var dt = new Date(year, month - 1, '01');
                dt.setDate(1);
                dt.setMonth(dt.getMonth() + 2);
                var cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
                if (type) {
                    return ft;
                } else {
                    return cdt;
                }
            },
            showSchedule: function (item, detailType, chartService, cb) {
                var me = this;
                this.postData(this.api.programSchedule + 'getProgramScheduleById', {
                    id: item.pid,
                    domain: item.domain
                }, function (schedule) {
                    schedule.detailType = detailType;
                    me.confirmDialog(750, '排期详情', schedule, "tpl/schedule_details.html", function (type, ngDialog, vm) {
                        if (cb) {
                            cb(type);
                        }
                    }, function (vm) {
                        vm.playList = [];
                        for (var i = 0; i < schedule.programs.length; i++) {
                            var chartItem = {
                                id: schedule.programs[i].id,
                                name: schedule.programs[i].name,
                                size: schedule.programs[i].size,
                                materials: schedule.programs[i].materials,
                                duration: schedule.programs[i].duration,
                                content: schedule.programs[i].content,
                                startDate: schedule.programs[i].startDate.toString(),
                                endDate: schedule.programs[i].endDate.toString(),
                                stype: schedule.programs[i].stype
                            };
                            if (schedule.programs[i].stype == 1) {
                                chartItem.startTime = schedule.programs[i].startTime;
                                chartItem.endTime = schedule.programs[i].endTime;
                                chartItem.plays = schedule.programs[i].plays;
                            }
                            vm.playList.push(chartItem);
                            var minLen = 12;
                            if (vm.playList.length > minLen) {
                                minLen = vm.playList.length;
                            }
                            vm.chartStyle = {
                                height: minLen * 30 + 30 + 'px',
                                width: '719px'
                            }
                        }
                        vm.eoption = chartService.initChartSchedule(vm.playList, minLen);
                    });
                })
            },
            citiesNo: {
                "370100": {
                    "p": "117.024967,36.682785|12",
                    "n": "济南"
                },
                "370900": {
                    "p": "117.089415,36.188078|13",
                    "n": "泰安"
                },
                "530100": {
                    "p": "102.714601,25.049153|12",
                    "n": "昆明"
                },
                "441500": {
                    "p": "115.372924,22.778731|14",
                    "n": "汕尾"
                },
                "421100": {
                    "p": "114.906618,30.446109|14",
                    "n": "黄冈"
                },
                "330200": {
                    "p": "121.579006,29.885259|12",
                    "n": "宁波"
                },
                "610100": {
                    "p": "108.953098,34.2778|12",
                    "n": "西安"
                },
                "340800": {
                    "p": "117.058739,30.537898|13",
                    "n": "安庆"
                },
                "420800": {
                    "p": "112.21733,31.042611|13",
                    "n": "荆门"
                },
                "231000": {
                    "p": "129.608035,44.588521|13",
                    "n": "牡丹江"
                },
                "640300": {
                    "p": "106.208254,37.993561|14",
                    "n": "吴忠"
                },
                "210300": {
                    "p": "123.007763,41.118744|13",
                    "n": "鞍山"
                },
                "411300": {
                    "p": "112.542842,33.01142|13",
                    "n": "南阳"
                },
                "510600": {
                    "p": "104.402398,31.13114|13",
                    "n": "德阳"
                },
                "451300": {
                    "p": "109.231817,23.741166|14",
                    "n": "来宾"
                },
                "621100": {
                    "p": "104.626638,35.586056|13",
                    "n": "定西"
                },
                "371300": {
                    "p": "118.340768,35.072409|12",
                    "n": "临沂"
                },
                "430600": {
                    "p": "113.146196,29.378007|13",
                    "n": "岳阳"
                },
                "130200": {
                    "p": "118.183451,39.650531|13",
                    "n": "唐山"
                },
                "650100": {
                    "p": "87.564988,43.84038|12",
                    "n": "乌鲁木齐"
                },
                "520300": {
                    "p": "106.93126,27.699961|13",
                    "n": "遵义"
                },
                "220100": {
                    "p": "125.313642,43.898338|12",
                    "n": "长春"
                },
                "222400": {
                    "p": "129.485902,42.896414|13",
                    "n": "延边"
                },
                "440400": {
                    "p": "113.562447,22.256915|13",
                    "n": "珠海"
                },
                "445300": {
                    "p": "112.050946,22.937976|13",
                    "n": "云浮"
                },
                "350500": {
                    "p": "118.600362,24.901652|12",
                    "n": "泉州"
                },
                "360300": {
                    "p": "113.859917,27.639544|13",
                    "n": "萍乡"
                },
                "530900": {
                    "p": "100.092613,23.887806|14",
                    "n": "临沧"
                },
                "150600": {
                    "p": "109.993706,39.81649|12",
                    "n": "鄂尔多斯"
                },
                "152900": {
                    "p": "105.695683,38.843075|14",
                    "n": "阿拉善盟"
                },
                "620800": {
                    "p": "106.688911,35.55011|13",
                    "n": "平凉"
                },
                "341200": {
                    "p": "115.820932,32.901211|13",
                    "n": "阜阳"
                },
                "511800": {
                    "p": "103.009356,29.999716|13",
                    "n": "雅安"
                },
                "211400": {
                    "p": "120.860758,40.74303|13",
                    "n": "葫芦岛"
                },
                "140800": {
                    "p": "111.006854,35.038859|13",
                    "n": "运城"
                },
                "410100": {
                    "p": "113.649644,34.75661|12",
                    "n": "郑州"
                },
                "320400": {
                    "p": "119.981861,31.771397|12",
                    "n": "常州"
                },
                "450200": {
                    "p": "109.422402,24.329053|12",
                    "n": "柳州"
                },
                "230700": {
                    "p": "128.910766,47.734685|14",
                    "n": "伊春"
                },
                "410900": {
                    "p": "115.026627,35.753298|12",
                    "n": "濮阳"
                },
                "370800": {
                    "p": "116.600798,35.402122|13",
                    "n": "济宁"
                },
                "441400": {
                    "p": "116.126403,24.304571|13",
                    "n": "梅州"
                },
                "421000": {
                    "p": "112.241866,30.332591|12",
                    "n": "荆州"
                },
                "330300": {
                    "p": "120.690635,28.002838|12",
                    "n": "温州"
                },
                "141100": {
                    "p": "111.143157,37.527316|14",
                    "n": "吕梁"
                },
                "610200": {
                    "p": "108.968067,34.908368|13",
                    "n": "铜川"
                },
                "420700": {
                    "p": "114.895594,30.384439|14",
                    "n": "鄂州"
                },
                "340100": {
                    "p": "117.282699,31.866942|12",
                    "n": "合肥"
                },
                "510500": {
                    "p": "105.44397,28.89593|14",
                    "n": "泸州"
                },
                "640200": {
                    "p": "106.379337,39.020223|13",
                    "n": "石嘴山"
                },
                "210200": {
                    "p": "121.593478,38.94871|12",
                    "n": "大连"
                },
                "411200": {
                    "p": "111.181262,34.78332|13",
                    "n": "三门峡"
                },
                "451200": {
                    "p": "108.069948,24.699521|14",
                    "n": "河池"
                },
                "371200": {
                    "p": "117.684667,36.233654|13",
                    "n": "莱芜"
                },
                "512000": {
                    "p": "104.63593,30.132191|13",
                    "n": "资阳"
                },
                "621200": {
                    "p": "104.934573,33.39448|14",
                    "n": "陇南"
                },
                "220800": {
                    "p": "122.840777,45.621086|13",
                    "n": "白城"
                },
                "130100": {
                    "p": "114.522082,38.048958|12",
                    "n": "石家庄"
                },
                "430500": {
                    "p": "111.461525,27.236811|13",
                    "n": "邵阳"
                },
                "640100": {
                    "p": "106.206479,38.502621|12",
                    "n": "银川"
                },
                "520400": {
                    "p": "105.92827,26.228595|13",
                    "n": "安顺"
                },
                "130900": {
                    "p": "116.863806,38.297615|13",
                    "n": "沧州"
                },
                "440300": {
                    "p": "114.025974,22.546054|12",
                    "n": "深圳"
                },
                "445200": {
                    "p": "116.379501,23.547999|13",
                    "n": "揭阳"
                },
                "350400": {
                    "p": "117.642194,26.270835|14",
                    "n": "三明"
                },
                "230600": {
                    "p": "125.02184,46.596709|12",
                    "n": "大庆"
                },
                "360200": {
                    "p": "117.186523,29.303563|12",
                    "n": "景德镇"
                },
                "450900": {
                    "p": "110.151676,22.643974|14",
                    "n": "玉林"
                },
                "150500": {
                    "p": "122.260363,43.633756|12",
                    "n": "通辽"
                },
                "511700": {
                    "p": "107.494973,31.214199|14",
                    "n": "达州"
                },
                "620900": {
                    "p": "98.508415,39.741474|13",
                    "n": "酒泉"
                },
                "341300": {
                    "p": "116.988692,33.636772|13",
                    "n": "宿州"
                },
                "320500": {
                    "p": "120.619907,31.317987|12",
                    "n": "苏州"
                },
                "140700": {
                    "p": "112.738514,37.693362|13",
                    "n": "晋中"
                },
                "211300": {
                    "p": "120.446163,41.571828|13",
                    "n": "朝阳"
                },
                "450100": {
                    "p": "108.297234,22.806493|12",
                    "n": "南宁"
                },
                "620100": {
                    "p": "103.823305,36.064226|12",
                    "n": "兰州"
                },
                "429021": {
                    "p": "110.487231,31.595768|13",
                    "n": "神农架林区"
                },
                "410400": {
                    "p": "113.300849,33.745301|13",
                    "n": "平顶山"
                },
                "330400": {
                    "p": "120.760428,30.773992|13",
                    "n": "嘉兴"
                },
                "460100": {
                    "p": "110.330802,20.022071|13",
                    "n": "海口"
                },
                "441700": {
                    "p": "111.97701,21.871517|14",
                    "n": "阳江"
                },
                "442000": {
                    "p": "113.42206,22.545178|12",
                    "n": "中山"
                },
                "370700": {
                    "p": "119.142634,36.716115|12",
                    "n": "潍坊"
                },
                "610300": {
                    "p": "107.170645,34.364081|12",
                    "n": "宝鸡"
                },
                "420200": {
                    "p": "115.050683,30.216127|13",
                    "n": "黄石"
                },
                "210900": {
                    "p": "121.660822,42.01925|14",
                    "n": "阜新"
                },
                "510400": {
                    "p": "101.722423,26.587571|14",
                    "n": "攀枝花"
                },
                "340200": {
                    "p": "118.384108,31.36602|12",
                    "n": "芜湖"
                },
                "520100": {
                    "p": "106.709177,26.629907|12",
                    "n": "贵阳"
                },
                "210100": {
                    "p": "123.432791,41.808645|12",
                    "n": "沈阳"
                },
                "371100": {
                    "p": "119.50718,35.420225|12",
                    "n": "日照"
                },
                "130400": {
                    "p": "114.482694,36.609308|13",
                    "n": "邯郸"
                },
                "411500": {
                    "p": "114.085491,32.128582|13",
                    "n": "信阳"
                },
                "430800": {
                    "p": "110.48162,29.124889|13",
                    "n": "张家界"
                },
                "440600": {
                    "p": "113.134026,23.035095|13",
                    "n": "佛山"
                },
                "420100": {
                    "p": "114.3162,30.581084|12",
                    "n": "武汉"
                },
                "350300": {
                    "p": "119.077731,25.44845|13",
                    "n": "莆田"
                },
                "220700": {
                    "p": "124.832995,45.136049|13",
                    "n": "松原"
                },
                "230500": {
                    "p": "131.171402,46.655102|13",
                    "n": "双鸭山"
                },
                "150800": {
                    "p": "107.423807,40.76918|12",
                    "n": "巴彦淖尔"
                },
                "360100": {
                    "p": "115.893528,28.689578|12",
                    "n": "南昌"
                },
                "421300": {
                    "p": "113.379358,31.717858|13",
                    "n": "随州"
                },
                "530700": {
                    "p": "100.229628,26.875351|13",
                    "n": "丽江"
                },
                "140200": {
                    "p": "113.290509,40.113744|12",
                    "n": "大同"
                },
                "450400": {
                    "p": "111.305472,23.485395|13",
                    "n": "梧州"
                },
                "360900": {
                    "p": "114.400039,27.81113|13",
                    "n": "宜春"
                },
                "211200": {
                    "p": "123.85485,42.299757|13",
                    "n": "铁岭"
                },
                "511600": {
                    "p": "106.63572,30.463984|13",
                    "n": "广安"
                },
                "320600": {
                    "p": "120.873801,32.014665|12",
                    "n": "南通"
                },
                "431100": {
                    "p": "111.614648,26.435972|13",
                    "n": "永州"
                },
                "620200": {
                    "p": "98.281635,39.802397|13",
                    "n": "嘉峪关"
                },
                "211100": {
                    "p": "122.073228,41.141248|13",
                    "n": "盘锦"
                },
                "410300": {
                    "p": "112.447525,34.657368|12",
                    "n": "洛阳"
                },
                "511400": {
                    "p": "103.84143,30.061115|13",
                    "n": "眉山"
                },
                "330500": {
                    "p": "120.137243,30.877925|12",
                    "n": "湖州"
                },
                "441600": {
                    "p": "114.713721,23.757251|12",
                    "n": "河源"
                },
                "632500": {
                    "p": "109.733755,19.180501|9",
                    "n": "海南"
                },
                "421200": {
                    "p": "114.300061,29.880657|13",
                    "n": "咸宁"
                },
                "370600": {
                    "p": "121.309555,37.536562|12",
                    "n": "烟台"
                },
                "310100": {
                    "p": "121.487899,31.249162|12",
                    "n": "上海"
                },
                "460200": {
                    "p": "109.522771,18.257776|12",
                    "n": "三亚"
                },
                "469028": {
                    "p": "109.948661,18.575985|12",
                    "n": "陵水"
                },
                "610400": {
                    "p": "108.707509,34.345373|13",
                    "n": "咸阳"
                },
                "469027": {
                    "p": "109.062698,18.658614|12",
                    "n": "乐东"
                },
                "469026": {
                    "p": "109.0113,19.222483|12",
                    "n": "昌江"
                },
                "469025": {
                    "p": "109.358586,19.216056|12",
                    "n": "白沙"
                },
                "420900": {
                    "p": "113.935734,30.927955|13",
                    "n": "孝感"
                },
                "469024": {
                    "p": "109.724101,19.805922|13",
                    "n": "临高"
                },
                "469023": {
                    "p": "109.996736,19.693135|13",
                    "n": "澄迈"
                },
                "654300": {
                    "p": "88.137915,47.839744|13",
                    "n": "阿勒泰地区"
                },
                "469022": {
                    "p": "110.063364,19.347749|13",
                    "n": "屯昌"
                },
                "469021": {
                    "p": "110.32009,19.490991|13",
                    "n": "定安"
                },
                "520200": {
                    "p": "104.852087,26.591866|13",
                    "n": "六盘水"
                },
                "451400": {
                    "p": "107.357322,22.415455|14",
                    "n": "崇左"
                },
                "210800": {
                    "p": "122.233391,40.668651|13",
                    "n": "营口"
                },
                "340300": {
                    "p": "117.35708,32.929499|13",
                    "n": "蚌埠"
                },
                "321000": {
                    "p": "119.427778,32.408505|13",
                    "n": "扬州"
                },
                "411400": {
                    "p": "115.641886,34.438589|13",
                    "n": "商丘"
                },
                "510300": {
                    "p": "104.776071,29.359157|13",
                    "n": "自贡"
                },
                "371000": {
                    "p": "122.093958,37.528787|13",
                    "n": "威海"
                },
                "430700": {
                    "p": "111.653718,29.012149|12",
                    "n": "常德"
                },
                "130300": {
                    "p": "119.604368,39.945462|12",
                    "n": "秦皇岛"
                },
                "440500": {
                    "p": "116.72865,23.383908|13",
                    "n": "汕头"
                },
                "350200": {
                    "p": "118.103886,24.489231|12",
                    "n": "厦门"
                },
                "652900": {
                    "p": "80.269846,41.171731|12",
                    "n": "阿克苏地区"
                },
                "610500": {
                    "p": "109.483933,34.502358|13",
                    "n": "渭南"
                },
                "220600": {
                    "p": "126.435798,41.945859|13",
                    "n": "白山"
                },
                "469029": {
                    "p": "109.656113,18.597592|12",
                    "n": "保亭"
                },
                "530800": {
                    "p": "100.980058,22.788778|14",
                    "n": "普洱"
                },
                "230400": {
                    "p": "130.292472,47.338666|13",
                    "n": "鹤岗"
                },
                "630100": {
                    "p": "101.767921,36.640739|12",
                    "n": "西宁"
                },
                "140100": {
                    "p": "112.550864,37.890277|12",
                    "n": "太原"
                },
                "150700": {
                    "p": "119.760822,49.201636|12",
                    "n": "呼伦贝尔"
                },
                "653200": {
                    "p": "79.930239,37.116774|13",
                    "n": "和田地区"
                },
                "320700": {
                    "p": "119.173872,34.601549|12",
                    "n": "连云港"
                },
                "469030": {
                    "p": "109.861849,19.039771|12",
                    "n": "琼中"
                },
                "450300": {
                    "p": "110.26092,25.262901|12",
                    "n": "桂林"
                },
                "410200": {
                    "p": "114.351642,34.801854|13",
                    "n": "开封"
                },
                "511500": {
                    "p": "104.633019,28.769675|13",
                    "n": "宜宾"
                },
                "152200": {
                    "p": "122.048167,46.083757|11",
                    "n": "兴安盟"
                },
                "140900": {
                    "p": "112.727939,38.461031|12",
                    "n": "忻州"
                },
                "360800": {
                    "p": "114.992039,27.113848|13",
                    "n": "吉安"
                },
                "232700": {
                    "p": "124.196104,51.991789|10",
                    "n": "大兴安岭地区"
                },
                "341500": {
                    "p": "116.505253,31.755558|13",
                    "n": "六安"
                },
                "431000": {
                    "p": "113.037704,25.782264|13",
                    "n": "郴州"
                },
                "431300": {
                    "p": "111.996396,27.741073|13",
                    "n": "娄底"
                },
                "131000": {
                    "p": "116.703602,39.518611|13",
                    "n": "廊坊"
                },
                "620300": {
                    "p": "102.208126,38.516072|13",
                    "n": "金昌"
                },
                "511300": {
                    "p": "106.105554,30.800965|13",
                    "n": "南充"
                },
                "211000": {
                    "p": "123.172451,41.273339|14",
                    "n": "辽阳"
                },
                "410600": {
                    "p": "114.29777,35.755426|13",
                    "n": "鹤壁"
                },
                "441900": {
                    "p": "113.763434,23.043024|12",
                    "n": "东莞"
                },
                "330600": {
                    "p": "120.592467,30.002365|13",
                    "n": "绍兴"
                },
                "370500": {
                    "p": "118.583926,37.487121|12",
                    "n": "东营"
                },
                "469006": {
                    "p": "110.292505,18.839886|13",
                    "n": "万宁"
                },
                "469005": {
                    "p": "110.780909,19.750947|13",
                    "n": "文昌"
                },
                "361100": {
                    "p": "117.955464,28.457623|13",
                    "n": "上饶"
                },
                "469002": {
                    "p": "110.414359,19.21483|13",
                    "n": "琼海"
                },
                "654200": {
                    "p": "82.974881,46.758684|12",
                    "n": "塔城地区"
                },
                "469001": {
                    "p": "109.51775,18.831306|13",
                    "n": "五指山"
                },
                "120100": {
                    "p": "117.210813,39.14393|12",
                    "n": "天津"
                },
                "210700": {
                    "p": "121.147749,41.130879|13",
                    "n": "锦州"
                },
                "321200": {
                    "p": "119.919606,32.476053|13",
                    "n": "泰州"
                },
                "340400": {
                    "p": "117.018639,32.642812|13",
                    "n": "淮南"
                },
                "430200": {
                    "p": "113.131695,27.827433|13",
                    "n": "株洲"
                },
                "321100": {
                    "p": "119.455835,32.204409|13",
                    "n": "镇江"
                },
                "350900": {
                    "p": "119.542082,26.656527|14",
                    "n": "宁德"
                },
                "411700": {
                    "p": "114.049154,32.983158|13",
                    "n": "驻马店"
                },
                "440800": {
                    "p": "110.365067,21.257463|13",
                    "n": "湛江"
                },
                "130600": {
                    "p": "115.49481,38.886565|13",
                    "n": "保定"
                },
                "350100": {
                    "p": "119.330221,26.047125|12",
                    "n": "福州"
                },
                "220500": {
                    "p": "125.94265,41.736397|13",
                    "n": "通化"
                },
                "652800": {
                    "p": "86.121688,41.771362|12",
                    "n": "巴音郭楞"
                },
                "469007": {
                    "p": "108.85101,18.998161|13",
                    "n": "东方"
                },
                "371700": {
                    "p": "115.46336,35.26244|13",
                    "n": "菏泽"
                },
                "610600": {
                    "p": "109.50051,36.60332|13",
                    "n": "延安"
                },
                "230300": {
                    "p": "130.941767,45.32154|13",
                    "n": "鸡西"
                },
                "532800": {
                    "p": "100.803038,22.009433|13",
                    "n": "西双版纳"
                },
                "530500": {
                    "p": "99.177996,25.120489|13",
                    "n": "保山"
                },
                "653100": {
                    "p": "75.992973,39.470627|12",
                    "n": "喀什地区"
                },
                "140400": {
                    "p": "113.120292,36.201664|12",
                    "n": "长治"
                },
                "150200": {
                    "p": "109.846239,40.647119|12",
                    "n": "包头"
                },
                "152500": {
                    "p": "116.02734,43.939705|11",
                    "n": "锡林郭勒盟"
                },
                "320800": {
                    "p": "119.030186,33.606513|12",
                    "n": "淮安"
                },
                "450600": {
                    "p": "108.351791,21.617398|15",
                    "n": "防城港"
                },
                "360700": {
                    "p": "114.935909,25.845296|13",
                    "n": "赣州"
                },
                "620400": {
                    "p": "104.171241,36.546682|13",
                    "n": "白银"
                },
                "341600": {
                    "p": "115.787928,33.871211|13",
                    "n": "亳州"
                },
                "431200": {
                    "p": "109.986959,27.557483|13",
                    "n": "怀化"
                },
                "410500": {
                    "p": "114.351807,36.110267|12",
                    "n": "安阳"
                },
                "441800": {
                    "p": "113.040773,23.698469|13",
                    "n": "清远"
                },
                "330700": {
                    "p": "119.652576,29.102899|12",
                    "n": "金华"
                },
                "429006": {
                    "p": "113.12623,30.649047|13",
                    "n": "天门"
                },
                "370400": {
                    "p": "117.279305,34.807883|13",
                    "n": "枣庄"
                },
                "429005": {
                    "p": "112.768768,30.343116|13",
                    "n": "潜江"
                },
                "460400": {
                    "p": "109.413973,19.571153|13",
                    "n": "儋州"
                },
                "429004": {
                    "p": "113.387448,30.293966|13",
                    "n": "仙桃"
                },
                "420300": {
                    "p": "110.801229,32.636994|13",
                    "n": "十堰"
                },
                "331000": {
                    "p": "121.440613,28.668283|13",
                    "n": "台州"
                },
                "361000": {
                    "p": "116.360919,27.954545|13",
                    "n": "抚州"
                },
                "340500": {
                    "p": "118.515882,31.688528|13",
                    "n": "马鞍山"
                },
                "210600": {
                    "p": "124.338543,40.129023|12",
                    "n": "丹东"
                },
                "510900": {
                    "p": "105.564888,30.557491|12",
                    "n": "遂宁"
                },
                "321300": {
                    "p": "118.296893,33.95205|13",
                    "n": "宿迁"
                },
                "430100": {
                    "p": "112.979353,28.213478|12",
                    "n": "长沙"
                },
                "350800": {
                    "p": "117.017997,25.078685|13",
                    "n": "龙岩"
                },
                "510100": {
                    "p": "104.067923,30.679943|12",
                    "n": "成都"
                },
                "130500": {
                    "p": "114.520487,37.069531|13",
                    "n": "邢台"
                },
                "411600": {
                    "p": "114.654102,33.623741|13",
                    "n": "周口"
                },
                "440700": {
                    "p": "113.078125,22.575117|13",
                    "n": "江门"
                },
                "430900": {
                    "p": "112.366547,28.588088|13",
                    "n": "益阳"
                },
                "331100": {
                    "p": "119.929576,28.4563|13",
                    "n": "丽水"
                },
                "610700": {
                    "p": "107.045478,33.081569|13",
                    "n": "汉中"
                },
                "371600": {
                    "p": "117.968292,37.405314|12",
                    "n": "滨州"
                },
                "220400": {
                    "p": "125.133686,42.923303|13",
                    "n": "辽源"
                },
                "150900": {
                    "p": "113.112846,41.022363|12",
                    "n": "乌兰察布"
                },
                "530600": {
                    "p": "103.725021,27.340633|13",
                    "n": "昭通"
                },
                "230200": {
                    "p": "123.987289,47.3477|13",
                    "n": "齐齐哈尔"
                },
                "611000": {
                    "p": "109.934208,33.873907|13",
                    "n": "商洛"
                },
                "140300": {
                    "p": "113.569238,37.869529|13",
                    "n": "阳泉"
                },
                "320900": {
                    "p": "120.148872,33.379862|12",
                    "n": "盐城"
                },
                "450500": {
                    "p": "109.122628,21.472718|13",
                    "n": "北海"
                },
                "150100": {
                    "p": "111.660351,40.828319|12",
                    "n": "呼和浩特"
                },
                "341700": {
                    "p": "117.494477,30.660019|14",
                    "n": "池州"
                },
                "620500": {
                    "p": "105.736932,34.584319|13",
                    "n": "天水"
                },
                "320100": {
                    "p": "118.778074,32.057236|12",
                    "n": "南京"
                },
                "360600": {
                    "p": "117.03545,28.24131|13",
                    "n": "鹰潭"
                },
                "410800": {
                    "p": "113.211836,35.234608|13",
                    "n": "焦作"
                },
                "370300": {
                    "p": "118.059134,36.804685|12",
                    "n": "淄博"
                },
                "330800": {
                    "p": "118.875842,28.95691|12",
                    "n": "衢州"
                },
                "540100": {
                    "p": "91.111891,29.662557|13",
                    "n": "拉萨"
                },
                "542400": {
                    "p": "92.067018,31.48068|14",
                    "n": "那曲地区"
                },
                "511100": {
                    "p": "103.760824,29.600958|13",
                    "n": "乐山"
                },
                "110100": {
                    "p": "116.395645,39.929986|12",
                    "n": "北京"
                },
                "441300": {
                    "p": "114.410658,23.11354|12",
                    "n": "惠州"
                },
                "141000": {
                    "p": "111.538788,36.099745|13",
                    "n": "临汾"
                },
                "420600": {
                    "p": "112.176326,32.094934|12",
                    "n": "襄阳"
                },
                "411100": {
                    "p": "114.046061,33.576279|13",
                    "n": "漯河"
                },
                "231200": {
                    "p": "126.989095,46.646064|13",
                    "n": "绥化"
                },
                "640500": {
                    "p": "105.196754,37.521124|14",
                    "n": "中卫"
                },
                "451100": {
                    "p": "111.552594,24.411054|14",
                    "n": "贺州"
                },
                "340600": {
                    "p": "116.791447,33.960023|13",
                    "n": "淮北"
                },
                "510800": {
                    "p": "105.819687,32.44104|13",
                    "n": "广元"
                },
                "210500": {
                    "p": "123.778062,41.325838|12",
                    "n": "本溪"
                },
                "350700": {
                    "p": "118.181883,26.643626|13",
                    "n": "南平"
                },
                "430400": {
                    "p": "112.583819,26.898164|13",
                    "n": "衡阳"
                },
                "130800": {
                    "p": "117.933822,40.992521|14",
                    "n": "承德"
                },
                "220300": {
                    "p": "124.391382,43.175525|12",
                    "n": "四平"
                },
                "440200": {
                    "p": "113.594461,24.80296|13",
                    "n": "韶关"
                },
                "445100": {
                    "p": "116.630076,23.661812|13",
                    "n": "潮州"
                },
                "371500": {
                    "p": "115.986869,36.455829|12",
                    "n": "聊城"
                },
                "610800": {
                    "p": "109.745926,38.279439|12",
                    "n": "榆林"
                },
                "659004": {
                    "p": "87.565449,44.368899|13",
                    "n": "五家渠"
                },
                "659003": {
                    "p": "79.198155,39.889223|13",
                    "n": "图木舒克"
                },
                "341800": {
                    "p": "118.752096,30.951642|13",
                    "n": "宣城"
                },
                "659002": {
                    "p": "81.291737,40.61568|13",
                    "n": "阿拉尔"
                },
                "450800": {
                    "p": "109.613708,23.103373|13",
                    "n": "贵港"
                },
                "230100": {
                    "p": "126.657717,45.773225|12",
                    "n": "哈尔滨"
                },
                "532600": {
                    "p": "104.089112,23.401781|14",
                    "n": "文山"
                },
                "150400": {
                    "p": "118.930761,42.297112|12",
                    "n": "赤峰"
                },
                "500200": {
                    "p": "106.530635,29.544606|12",
                    "n": "重庆"
                },
                "530300": {
                    "p": "103.782539,25.520758|12",
                    "n": "曲靖"
                },
                "140600": {
                    "p": "112.479928,39.337672|13",
                    "n": "朔州"
                },
                "341000": {
                    "p": "118.29357,29.734435|13",
                    "n": "黄山"
                },
                "659001": {
                    "p": "86.041865,44.308259|13",
                    "n": "石河子"
                },
                "230900": {
                    "p": "131.019048,45.775005|14",
                    "n": "七台河"
                },
                "620600": {
                    "p": "102.640147,37.933172|13",
                    "n": "武威"
                },
                "360500": {
                    "p": "114.947117,27.822322|13",
                    "n": "新余"
                },
                "320200": {
                    "p": "120.305456,31.570037|12",
                    "n": "无锡"
                },
                "410700": {
                    "p": "113.91269,35.307258|13",
                    "n": "新乡"
                },
                "511000": {
                    "p": "105.073056,29.599462|13",
                    "n": "内江"
                },
                "131100": {
                    "p": "115.686229,37.746929|13",
                    "n": "衡水"
                },
                "370200": {
                    "p": "120.384428,36.105215|12",
                    "n": "青岛"
                },
                "330900": {
                    "p": "122.169872,30.03601|13",
                    "n": "舟山"
                },
                "542500": {
                    "p": "81.107669,30.404557|11",
                    "n": "阿里地区"
                },
                "330100": {
                    "p": "120.219375,30.259244|12",
                    "n": "杭州"
                },
                "441200": {
                    "p": "112.479653,23.078663|13",
                    "n": "肇庆"
                },
                "420500": {
                    "p": "111.310981,30.732758|13",
                    "n": "宜昌"
                },
                "422800": {
                    "p": "109.517433,30.308978|14",
                    "n": "恩施"
                },
                "340700": {
                    "p": "117.819429,30.94093|14",
                    "n": "铜陵"
                },
                "210400": {
                    "p": "123.92982,41.877304|12",
                    "n": "抚顺"
                },
                "231100": {
                    "p": "127.50083,50.25069|14",
                    "n": "黑河"
                },
                "411000": {
                    "p": "113.835312,34.02674|13",
                    "n": "许昌"
                },
                "510700": {
                    "p": "104.705519,31.504701|12",
                    "n": "绵阳"
                },
                "640400": {
                    "p": "106.285268,36.021523|13",
                    "n": "固原"
                },
                "451000": {
                    "p": "106.631821,23.901512|13",
                    "n": "百色"
                },
                "350600": {
                    "p": "117.676205,24.517065|12",
                    "n": "漳州"
                },
                "371400": {
                    "p": "116.328161,37.460826|12",
                    "n": "德州"
                },
                "430300": {
                    "p": "112.935556,27.835095|13",
                    "n": "湘潭"
                },
                "621000": {
                    "p": "107.644227,35.726801|13",
                    "n": "庆阳"
                },
                "650200": {
                    "p": "84.88118,45.594331|13",
                    "n": "克拉玛依"
                },
                "440900": {
                    "p": "110.931245,21.668226|13",
                    "n": "茂名"
                },
                "610900": {
                    "p": "109.038045,32.70437|13",
                    "n": "安康"
                },
                "220200": {
                    "p": "126.564544,43.871988|12",
                    "n": "吉林市"
                },
                "130700": {
                    "p": "114.893782,40.811188|13",
                    "n": "张家口"
                },
                "440100": {
                    "p": "113.30765,23.120049|12",
                    "n": "广州"
                },
                "360400": {
                    "p": "115.999848,29.71964|13",
                    "n": "九江"
                },
                "530400": {
                    "p": "102.545068,24.370447|13",
                    "n": "玉溪"
                },
                "450700": {
                    "p": "108.638798,21.97335|13",
                    "n": "钦州"
                },
                "500100": {
                    "p": "106.530635,29.544606|12",
                    "n": "重庆"
                },
                "140500": {
                    "p": "112.867333,35.499834|13",
                    "n": "晋城"
                },
                "150300": {
                    "p": "106.831999,39.683177|13",
                    "n": "乌海"
                },
                "341100": {
                    "p": "118.32457,32.317351|13",
                    "n": "滁州"
                },
                "320300": {
                    "p": "117.188107,34.271553|12",
                    "n": "徐州"
                },
                "511900": {
                    "p": "106.757916,31.869189|14",
                    "n": "巴中"
                },
                "230800": {
                    "p": "130.284735,46.81378|12",
                    "n": "佳木斯"
                },
                "620700": {
                    "p": "100.459892,38.93932|13",
                    "n": "张掖"
                }
            }
        }

        return baseService;
    }])
}