import angular from 'angular';
import "babel-polyfill"
//引入全局样式
import './app.depend.less'
import './main.less';
import './app.less';


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
        'smart-table',
        'pasvaz.bindonce',
        'qmedia.editor'
    ];
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

app.run(['$rootScope', '$state', '$location', '$stateParams', 'ngDialog', 'baseService', 'userService', ($rootScope, $state, $location, $stateParams, ngDialog, baseService, userService) => {
        $rootScope.paginationNumber = [10, 15, 20, 30, 50, 100];
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
    .config([  
        '$compileProvider',  
        function( $compileProvider )  
        {     
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);  
        }  
    ])
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