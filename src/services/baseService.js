import config from '../../configs/config'
import hex_md5 from '../libs/md5.js'

export default app => {
    app.factory('baseService', ['httpService', 'modalService', '$rootScope', '$state', 'programService', (httpService, modalService, $rootScope, $state, programService) => {
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
            getJson(url, requestData, cb) {
                let me = this;
                httpService.getJson(url, requestData)
                    .then((res) => {
                        let data = res.data;
                        if (data.code == 1) {
                            cb(data.content);
                        } else if (data.code == 2) {
                            me.goToState('login');
                        } else {
                            modalService.alert(data.message, 'warning');
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            modalService.alert('网络或服务端异常', 'warning')
                        }
                    })
            },
            postData(url, formData, cb) {
                let me = this;
                httpService.postData(url, formData)
                    .then((res) => {
                        let data = res.data;
                        if (data.code == 1) {
                            if (data.content) {
                                cb(data.content);
                            } else {
                                cb(data)
                            }
                        } else if (data.code == 2) {
                            me.goToState('login');
                            return false;
                        } else {
                            modalService.alert(data.message, 'warning');
                            cb();
                            return false;
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            modalService.alert('网络或服务端异常', 'warning')
                            if(cb){
                                cb();
                            }
                        }
                    })
            },
            saveForm(scope, url, formData, cb) {
                scope.isPosting = true;
                this.postData(url, formData, (res) => {
                    scope.isPosting = false;
                    cb(res);
                })
            },
            dmbdOSSImageUrlResizeFilter(imgUrl, size) {
                var joinChar = imgUrl.indexOf('?') >= 0 ? '&' : '?';
                return imgUrl + joinChar + 'x-oss-process=image/resize,m_lfit,h_' + size + ',w_' + size;
            },
            removeAryId(aObj, val) {
                var nArr = [];
                for (var i = 0; i < aObj.length; i++) {
                    if (aObj[i].id != val) {
                        nArr.push(aObj[i]);
                    }
                }
                return nArr;
            },
            removeAry(aObj, val) {
                var nArr = [];
                for (var i = 0; i < aObj.length; i++) {
                    if (aObj[i] != val) {
                        nArr.push(aObj[i]);
                    }
                }
                return nArr;
            },
            initTable($scope, tableState, url, cb) {
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
            formateDay(day) {
                if (day < 10) {
                    return '0' + day.toString();
                } else {
                    return day.toString();
                }
            },
            getPerms(cb) {
                this.postData(this.api.admin + 'getPermsList', {}, function (data) {
                    cb(data);
                })
            },
            getMonthTxt(month) {
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
            formateDay(day) {
                if (day < 10) {
                    return '0' + day.toString();
                } else {
                    return day.toString();
                }
            },
            formateDate(date) {
                let dateStr = date.toString();
                return dateStr.substring(0, 4) + '-' + dateStr.substring(4, 6) + '-' + dateStr.substring(6, 8);
            },
            formateDayTime(date) {
                return Date.parse(date.substring(0, 4) + '/' + date.substring(4, 6) + '/' + date.substring(6, 8));
            },
            formateDayTxt(date) {
                return date.substring(0, 4) + '年' + date.substring(4, 6) + '月' + date.substring(6, 8) + '日';
            },
            getFirstorLastDay(date, type) {
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
            showSchedule(item, detailType, chartService, cb) {
                let me = this;
                this.postData(this.api.programSchedule + 'getProgramScheduleById', {
                    id: item.pid,
                    domain: item.domain
                }, function (schedule) {
                    schedule.detailType = detailType;
                    modalService.confirmDialog(720, '排期详情', schedule, '/static/tpl/schedule_details.html', function (type, vm) {
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
                            vm.showPlay = function (nitem) {

                                item.detailType = 0;
                                programService.getProgramById(nitem.id, item.domain, function (program) {

                                    program.nstatus = '审核通过';
                                    modalService.confirmDialog(750, '节目预览', program, '/static/tpl/program_details.html', function (vm) {

                                    }, function (vm) {
                                        vm.program = program;
                                    }, 0)
                                });
                            }
                        }
                        vm.eoption = chartService.initChartSchedule(vm.playList, minLen);
                    }, 0);
                })
            },
            showMaterial(item, detailType, cb) {
                item.detailType = detailType;
                item.nUrl = this.dmbdOSSImageUrlResizeFilter(item.path, 400);
                modalService.confirmDialog(720, detailType == 0 ? '素材详情' : '素材审核', item, '/static/tpl/material_detail.html', (type, vm) => {
                    if (cb) {
                        cb(type);
                    }
                }, (vm) => {
                    vm.imgPreview = function (item) {
                        $rootScope.$broadcast('callImg', item, 1);
                    }
                });

            },
            showProgram(item, detailType, cb) {
                var me = this;
                programService.getProgramById(item.pid, item.domain, function (program) {
                    program.detailType = detailType;
                    modalService.confirmDialog(750, detailType == 0 ? '节目详情' : '节目审核', program, '/static/tpl/program_details.html', function (vm) {

                    }, function (vm) {
                        vm.program = program;
                    })
                });

            },

        }

        return baseService;
    }])
}