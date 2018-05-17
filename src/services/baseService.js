import config from '../../configs/config'
import hex_md5 from '../libs/md5.js'
import confirmTpl from '../tpl/confirm.tpl.html'
import confirmDialogTpl from '../tpl/confirm_dialog.tpl.html'
import materialDetailTpl from '../tpl/material_detail.html'
import modalFooterCheckTpl from '../tpl/modal_footerCheck.html'
import scheduleDetailsTpl from '../tpl/schedule_details.html'
export default app => {
    app.factory('baseService', ['$rootScope', '$http', '$state', 'ngDialog', '$alert','programService', ($rootScope, $http, $state, ngDialog, $alert,programService) => {
        let apiUrl = config.host;
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
                checkModel: apiUrl + '/api/checkModel/',
                report: apiUrl + '/api/report/',
                chargeStat: apiUrl + '/api/chargeStat/',
                role: apiUrl + '/api/role/'
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
            goToState(state, params) {
                $state.go(state, params)
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
                ngDialog.openConfirm({
                    template: confirmTpl,
                    cache: false,
                    plain: true,
                    className: 'ngdialog-theme-default',
                    controller: ['$scope', function ($scope) {
                        $scope.info = info
                        $scope.title = title
                        $scope.isPosting = !posting;
                        $scope.confirm = () => {
                            $scope.isPosting = posting;
                            cb($scope);
                        }

                    }],
                    width: 540
                })

            },
            confirmDialog(width,title, data, html, cb, beforeOpen, type) {
                this.beforeOpen = beforeOpen || 0
                let me = this;
                ngDialog.openConfirm({
                    template: confirmDialogTpl,
                    plain: true,
                    cache: false,
                    className: 'ngdialog-theme-default',
                    width: width,
                    controller: ['$scope', function ($scope) {
                        $scope.data = data
                        $scope.title = title
                        $scope.html = html
                        if (me.isRealNum(type)) {
                            switch(type){
                                case 0:
                                $scope.replaceFooterHtml = '<div></div';
                                break;
                                case 1:
                                $scope.replaceFooterHtml = modalFooterCheckTpl;
                                break;
                            }
                        }
                        if (beforeOpen) {
                            beforeOpen($scope)
                        }

                        $scope.confirm = function (type) {
                            cb($scope,type);
                        }
                        $scope.cancel = function () {
                            $scope.closeThisDialog()
                        }

                    }]
                })
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
            removeAryId: function (aObj, val) {
                var nArr = [];
                for (var i = 0; i < aObj.length; i++) {
                    if (aObj[i].id != val) {
                        nArr.push(aObj[i]);
                    }
                }
                return nArr;
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
            initTable: function ($scope, tableState, url, cb) {
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
            formateDate: function (date) {
                let dateStr = date.toString();
                return dateStr.substring(0, 4) + '-' + dateStr.substring(4, 6) + '-' + dateStr.substring(6, 8);
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
                let me = this;
                this.postData(this.api.programSchedule + 'getProgramScheduleById', {
                    id: item.pid,
                    domain: item.domain
                }, function (schedule) {
                    schedule.detailType = detailType;
                    me.confirmDialog(720, '排期详情', schedule, scheduleDetailsTpl, function (type, vm) {
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
                    },0);
                })
            },
            showMaterial: function (item, detailType, cb) {
                item.detailType = detailType;
                item.nUrl = this.dmbdOSSImageUrlResizeFilter(item.path, 400);
                this.confirmDialog(720,detailType == 2 ? '素材详情' : '素材审核', item, materialDetailTpl, (type, vm) => {
                    if (cb) {
                        cb(type);
                    }
                }, (vm) => {
                    vm.imgPreview = function (item) {
                        $rootScope.$broadcast('callImg', item, 1);
                    }
                }, 1);

            },
            showProgram: function (item, detailType, cb) {
                var me = this;
                programService.getProgramById(item.pid, item.domain, function (program) {
                    program.status = item.pStatus ? item.pStatus : item.status;
                    program.detailType = detailType;
                    me.confirmDialog('节目预览', program, "tpl/program_details.html", function (type, ngDialog, vm) {
                        if (cb) {
                            cb(type);
                        }
                    }, function (vm) {
                        vm.program = program;
                        vm.programPreview = function (program) {
                            $rootScope.$broadcast('callImg', program, 2);
                        }
                    });
                });

            },
            
        }

        return baseService;
    }])
}