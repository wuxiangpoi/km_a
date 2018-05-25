import angular from 'angular';

//引入全局样式
import './app.depend.less'
import './main.less';
import './app.less';

//引入js
// import '../bower_components/jquery.cookie/jquery.cookie.js'
// import './libs/bootstrap/dist/js/bootstrap.min.js'

// import '../bower_components/jquery-ui/jquery-ui.js'
//import '../bower_components/layer/dist/theme/default/layer.css'
// import layer from '../bower_components/layer/dist/layer.js'

let loadBasicModules = () => {
    let ngDepModules = [
        'ngAnimate',
        'ngLocale',
        'ui.router',
        'oc.lazyLoad',
        'ui.sortable',
        'mgcrea.ngStrap',
        'ngDialog',
        'angularFileUpload',
        'ngMessages',
        'smart-table'
    ];
    //require('../bower_components/angular-animate/angular-animate.min.js');
    //ngDepModules.push('ngAnimate');

    //require('./libs/localService.js');
    //ngDepModules.push('ngLocale');

    // require('angular-ui-router');
    //ngDepModules.push('ui.router');

    //require('../bower_components/oclazyload/dist/ocLazyLoad');
    //ngDepModules.push('oc.lazyLoad');

    //require('../bower_components/angular-ui-sortable/sortable.js');
    //ngDepModules.push('ui.sortable');

    //require('./libs/lib.css');
    // require('../bower_components/angular-strap/dist/angular-strap.min.js');
    // require('../bower_components/angular-strap/dist/angular-strap.tpl.min.js');
    //ngDepModules.push('mgcrea.ngStrap');

    //require('../bower_components/ng-dialog/css/ngDialog.css');
    //require('../bower_components/ng-dialog/css/ngDialog-theme-default.css');
    //require('../bower_components/ng-dialog/js/ngDialog.js');
    //ngDepModules.push('ngDialog');

    //require('../bower_components/angular-file-upload/dist/angular-file-upload.min.js');
    //ngDepModules.push('angularFileUpload');

    //require('../bower_components/angular-messages/angular-messages.min.js');
    //ngDepModules.push('ngMessages');

    //require('./libs/smart-table/smart-table.js');
    //ngDepModules.push('smart-table');
    // require('angular-loading-bar');
    // require('angular-loading-bar/src/loading-bar.css');
    // ngDepModules.push('angular-loading-bar');

    let editor = require('../editor/main');
    ngDepModules.push(editor.name);

    return ngDepModules;
};

const app = angular.module('sbAdminApp', loadBasicModules());

//引入过滤器
import filters from './filter'

filters(app);

//引入全局services
import services from './services'

services(app);
//引入全局指令
import directives from './directives'

directives(app);

import dialogs from './dialogs';

dialogs(app);

import appRouter from './app.router';

appRouter(app);

import tbodyTpl from './tpl/table.html'
import tfooterTpl from './tpl/table_footer.html'
import noPicImg from './img/no_pic.jpg'

app.run(['$rootScope', '$state', '$location', '$stateParams', 'ngDialog', 'baseService', 'userService', ($rootScope, $state, $location, $stateParams, ngDialog, baseService, userService) => {
        $rootScope.paginationNumber = [10, 15, 20, 30, 50, 100];
        $rootScope.tbodyTpl = tbodyTpl;
        $rootScope.tfooterTpl = tfooterTpl;
        $rootScope.noPicImg = noPicImg;

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            ngDialog.close();

            if (!$rootScope.userData) {
                if (toState.name.split('.')[0] == 'dashboard') {
                    event.preventDefault();
                    userService.getUserSrc(function (userData) {
                        $rootScope.userData = userData;
                        $rootScope.userData.current_perms = userData.current_perms;
                        $rootScope.root_programReslotions = userData.root_programReslotions;

                        $state.go(toState.name, toParams);
                    });
                }
            }
        });
        $rootScope.getRootDicName = function (key, did) {
            var ar = $rootScope.userData.root_dic[key];
            for (var i in ar) {
                if (ar.hasOwnProperty(i)) {

                    var _dic = ar[i];
                    if (_dic.val == did) {
                        return _dic.name;
                    }
                }
            }
            return "";

        }
        $rootScope.getRootDicNameStrs = function (key) {
            var ar = $rootScope.userData.root_dic[key];
            var s = '';
            for (var i = 0; i < ar.length; i++) {
                var _dic = ar[i];
                s += "," + _dic.name;
            }
            if (s) {
                s = s.substr(1);
            }

            return s;

        }
        $rootScope.perms = function (rid) {
            if ($rootScope.userData) {
                return ("," + $rootScope.userData.current_perms + ",").indexOf("," + rid + ",") > -1 ? true : false;
            } else {
                return true;
            }
        }
        $rootScope.dmbdOSSImageUrlResizeFilter = function (imgUrl, size) {
            var joinChar = imgUrl.indexOf('?') >= 0 ? '&' : '?';
            return imgUrl + joinChar + 'x-oss-process=image/resize,m_lfit,' + size + ',w_' + size;
        }
        $rootScope.getCheckStatusAttrOld = function (val, index) {
            for (var i in $rootScope.root_checkStatusOld) {
                if ($rootScope.root_checkStatusOld.hasOwnProperty(i)) {

                    var _dic = $rootScope.root_checkStatusOld[i];
                    if (_dic.val == val) {
                        return index == 0 ? _dic.name : _dic.color;
                    }
                }
            }
            return '';
        }
        $rootScope.myKeyup = function (e, click, params) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                click(params);
            }
        };
    }])
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])
    .config(['$datepickerProvider', '$timepickerProvider', ($datepickerProvider, $timepickerProvider) => {
        angular.extend($datepickerProvider.defaults, {
            iconLeft: 'fa fa-angle-left',
            iconRight: 'fa fa-angle-right'
        });
        angular.extend($timepickerProvider.defaults, {
            iconUp: 'fa fa-angle-up',
            iconDown: 'fa fa-angle-down'
        });
    }])
    .config(['ngDialogProvider', function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            closeByDocument: true
        });
    }])
    .run(['fileUploaderOptions', function (fileUploaderOptions) {
        fileUploaderOptions.autoUpload = false;
        fileUploaderOptions.url = "http://dmbd4.oss-cn-hangzhou.aliyuncs.com"
    }]);