import angular from 'angular';

//引入全局样式
import '../bower_components/bootstrap/dist/css/bootstrap.min.css'

//引入字体图标
import './libs/font-awesome-4.7.0/css/font-awesome.min.css'
import './css/font/iconfont.css'

import './css/animate.css';
import './css/style.css';
import './app.less';

//引入js
import '../bower_components/jquery.cookie/jquery.cookie.js'
import '../bower_components/bootstrap/dist/js/bootstrap.min.js'

let loadBasicModules = () => {
    let ngDepModules = [];
    require('../bower_components/angular-animate/angular-animate.min.js');
    ngDepModules.push('ngAnimate');

    require('../bower_components/angular-sanitize/angular-sanitize.min.js');
    ngDepModules.push('ngSanitize');

    require('angular-ui-router');
    ngDepModules.push('ui.router');
    
    require('../bower_components/oclazyload/dist/ocLazyLoad');
    ngDepModules.push('oc.lazyLoad');

    require('../bower_components/angular-strap/dist/lib.css');
    require('../bower_components/angular-strap/dist/angular-strap.min.js');
    require('../bower_components/angular-strap/dist/angular-strap.tpl.min.js');
    ngDepModules.push('mgcrea.ngStrap');

    require('../bower_components/ng-dialog/css/ngDialog.min.css');
    require('../bower_components/ng-dialog/js/ngDialog.min.js');
    ngDepModules.push('ngDialog');

    require('../bower_components/angular-file-upload/dist/angular-file-upload.min.js');
    ngDepModules.push('angularFileUpload');

    require('../bower_components/angular-messages/angular-messages.min.js');
    ngDepModules.push('ngMessages');

    require('./libs/smart-table/smart-table.js');
    ngDepModules.push('smart-table');
    // require('angular-loading-bar');
    // require('angular-loading-bar/src/loading-bar.css');
    // ngDepModules.push('angular-loading-bar');

    return ngDepModules;
}
const app = angular.module('sbAdminApp', loadBasicModules());

//引入过滤器
import filter from './filter/filter.js'
filter(app);

//引入全局services
import services from './services'
services.forEach(service => {
    service(app);
})
//引入全局指令
import directives from './directives'
directives.forEach(directive => {
    directive(app);
})
import appRouter from './app.router';

appRouter(app);

import tbodyTpl from './tpl/table.html'
import tfooterTpl from './tpl/table_footer.html'

app.run(['$rootScope', '$state', '$location', '$stateParams', 'ngDialog', 'baseService', 'userService', ($rootScope, $state, $location, $stateParams, ngDialog, baseService, userService) => {
    $rootScope.paginationNumber = [10, 15, 20, 30, 50, 100];
    $rootScope.tbodyTpl = tbodyTpl;
    $rootScope.tfooterTpl = tfooterTpl;
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
}])

app.config(($datepickerProvider) => {
  angular.extend($datepickerProvider.defaults, {
    iconLeft: 'fa fa-angle-left',
    iconRight: 'fa fa-angle-right'
  });
})