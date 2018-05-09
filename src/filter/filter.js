import {terminalStatusOptions,scheduleStatusOptions} from './options';
import {citiesNo} from '../services/cityService'

export default app => {
    app.filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
    //OSS图片裁减
    app.filter('formateTime', function ($filter) {
        return function (date) {
            return $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
        }
    });
    app.filter('formateDate', function () {
        return function (date) {
            if (date) {
                return date.toString().substring(0, 4) + '-' + date.toString().substring(4, 6) + '-' + date.toString().substring(6, 8);
            } else {
                return ''
            }
        }
    });
    app.filter('formateMinate', function () {
        return function (date) {
            if (date) {
                return date.substring(0, 5);
            } else {
                return ''
            }
        }
    });
    app.filter('getCityName', function () {
        return function (cno) {
            let cName = '';
            for (let i in citiesNo) {
                if (i == cno) {
                    cName = citiesNo[i].n;
                }
            }
            return cName;
        }
    });
    //OSS图片裁减
    app.filter('play_url', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        }
    });

    app.filter('getOrganizations', function ($rootScope) {
        return function (oid) {
            var groups = $rootScope.userData.root_organizations;
            var cName = '';
            var finalName = [];

            function findParent(data) {
                if (data.pid == '') {
                    return finalName.reverse().push(cName);
                } else {

                    for (var i = 0; i < groups.length; i++) {
                        if (groups[i].id == data.pid) {
                            finalName.push(groups[i].name)
                            if (groups[i].pid == '') {
                                return finalName.reverse().push(cName);
                            } else {
                                findParent(groups[i]);
                            }
                        }
                    }
                }
            }
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].id == oid) {
                    cName = groups[i].name;
                    findParent(groups[i]);
                }
            }
            return finalName.join('>');
        }
    });
    app.filter('scheduleStatusTxt', function () {
        return function (status) {
            var statusTxt = '';
            for (var i = 0; i < scheduleStatusOptions.length; i++) {
                if (scheduleStatusOptions[i].val == status) {
                    statusTxt = scheduleStatusOptions[i].name;
                }
            }
            return statusTxt;
        };
    });
    app.filter('cmdCodeTxt', function () {
        var cmdCodeStatus = [{
                name: '节目下发',
                val: 21
            },
            {
                name: '节目停播',
                val: 22
            },
            {
                name: '排期下发',
                val: 24
            },
            {
                name: '排期停播',
                val: 25
            }

        ];
        return function (status) {
            var statusTxt = '';
            for (var i = 0; i < cmdCodeStatus.length; i++) {
                if (cmdCodeStatus[i].val == status) {
                    statusTxt = cmdCodeStatus[i].name;
                }
            }
            return statusTxt;
        };
    });
    app.filter('programStatusTxt', function () {
        var programStatus = [{
                name: '待提交审核',
                val: 0,
                color: 'grey'
            },
            {
                name: '审核通过',
                val: 1,
                color: '#5cb85c'
            },
            {
                name: '内部初审中',
                val: 2,
                color: 'blue'
            },
            {
                name: '平台审核中',
                val: 3,
                color: 'blue'
            },
            {
                name: '内部审核不通过',
                val: 4,
                color: '#d9534f'
            },
            {
                name: '平台审核不通过',
                val: 5,
                color: '#d9534f'
            },
            {
                name: '内部终审中',
                val: 6,
                color: '#d9534f'
            },
            {
                name: '内部终审不通过',
                val: 7,
                color: 'grey'
            }

        ];
        return function (status) {
            var statusTxt = '';
            for (var i = 0; i < programStatus.length; i++) {
                if (programStatus[i].val == status) {
                    statusTxt = programStatus[i].name;
                }
            }
            return statusTxt;
        };
    });
    app.filter('materialStatusTxt', function () {
        var materialStatus = [{
                name: '待提交审核',
                val: 0,
                color: 'grey'
            },
            {
                name: '审核通过',
                val: 1,
                color: '#5cb85c'
            },
            {
                name: '内部审核中',
                val: 2,
                color: 'blue'
            },
            {
                name: '平台审核中',
                val: 3,
                color: 'blue'
            },
            {
                name: '内部审核不通过',
                val: 4,
                color: '#d9534f'
            },
            {
                name: '平台审核不通过',
                val: 5,
                color: '#d9534f'
            },
            {
                name: '转码失败',
                val: 6,
                color: '#d9534f'
            },
            {
                name: '转码中',
                val: 7,
                color: 'grey'
            }

        ];
        return function (status) {
            var statusTxt = '';
            for (var i = 0; i < materialStatus.length; i++) {
                if (materialStatus[i].val == status) {
                    statusTxt = materialStatus[i].name;
                }
            }
            return statusTxt;
        };
    });
    app.filter('terminalStatusTxt', () => {
        return function (status) {
            var statusTxt = '';
            for (var i = 0; i < terminalStatusOptions.length; i++) {
                if (terminalStatusOptions[i].val == status) {
                    statusTxt = terminalStatusOptions[i].name;
                }
            }
            return statusTxt;
        };
    }),
    //尺寸过滤器(文件体积，显示GB、MB、KB等)
    app.filter('dmbdResourceSizeFilter', function () {
        return function (size) {
            if (size < 1024) {
                return size + ' B';
            } else if (size < 1024 * 1024) {
                return (size / 1024).toFixed(2) + ' KB';
            } else if (size < 1024 * 1024 * 1024) {
                return (size / 1024 / 1024).toFixed(2) + ' MB';
            } else if (size < 1024 * 1024 * 1024 * 1024) {
                return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
            } else {
                return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB';
            }
        };
    });

    function pading2(num) {
        return num < 10 ? '0' + num : num.toString(10);
    }

    //视频播放时长格式化过滤器
    app.filter('dmbdVideoTimeFormatFilter', function () {
        return function (seconds) {
            return pading2(Math.floor(seconds / 3600)) +
                ':' + pading2(Math.floor((seconds % 3600) / 60)) +
                ':' + pading2(seconds % 60);
        };
    });
}