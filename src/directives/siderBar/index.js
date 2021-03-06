import template from './template.html';
import style from './style.less';

let controller = ($rootScope, $scope, $state, baseService) => {
    $scope.collapseVar = '';
    $scope.state = '';
    $scope.menuList = [{
        name: '首页',
        auth: true,
        collapseVar: 0,
        state: 'dashboard.home',
        states: ['dashboard.home'],
        icon: 'iconfont icon-shouye'
    }, {
        name: '系统管理',
        auth: $rootScope.perms(1),
        collapseVar: 1,
        icon: 'fa fa-cogs fa-fw',
        state: '',
        states: ['dashboard.dictionary', 'dashboard.versionfile'],
        children: [{
                name: '数据字典',
                auth: $rootScope.perms(11),
                collapseVar: 1,
                state: 'dashboard.dictionary',
                icon: ''
            },
            {
                name: '版本文件管理',
                auth: $rootScope.perms(12),
                collapseVar: 1,
                state: 'dashboard.versionfile',
                icon: ''
            }
        ]
    }, 
    {
        name: '授权管理',
        auth: $rootScope.perms(6),
        collapseVar: 6,
        icon: 'fa fa-cogs fa-fw',
        state: '',
        states: ['dashboard.authorization', 'dashboard.boardDealer'],
        children: [{
                name: '板卡商管理',
                auth: $rootScope.perms(61),
                collapseVar: 6,
                state: 'dashboard.boardDealer',
                icon: ''
            },
            {
                name: '授权码管理',
                auth: $rootScope.perms(62),
                collapseVar: 6,
                state: 'dashboard.authorization',
                icon: ''
            }
        ]
    }, 
    {
        name: '企业管理',
        auth: $rootScope.perms(2),
        collapseVar: 2,
        state: 'dashboard.domain',
        states: ['dashboard.domain'],
        icon: 'fa fa-suitcase'
    }, {
        name: '终端管理',
        auth: $rootScope.perms(3),
        collapseVar: 3,
        state: 'dashboard.terminalreport',
        states: ['dashboard.terminalreport', 'dashboard.terminal'],
        icon: 'iconfont icon-zhongduanguanli'
    },
     {
        name: '审核管理',
        auth: $rootScope.perms(4),
        collapseVar: 4,
        state: '',
        states: ['dashboard.checkModel','dashboard.checkDealer'],
        icon: 'iconfont icon-shenheguanli',
        children: [{
                name: '内容审核',
                auth: $rootScope.perms(41),
                collapseVar: 4,
                state: 'dashboard.checkModel',
                icon: ''
            },
            {
                name: '商户审核',
                auth: true,
                collapseVar: $rootScope.perms(42),
                state: 'dashboard.checkDealer',
                icon: ''
            }
        ]
    }, 
    {
        name: '账户管理',
        auth: $rootScope.perms(5),
        collapseVar: 5,
        state: '',
        states: ['dashboard.user', 'dashboard.role'],
        icon: 'iconfont icon-zhanghuguanli',
        children: [{
                name: '账号管理',
                auth: true,
                collapseVar: 5,
                state: 'dashboard.user',
                icon: ''
            },
            {
                name: '角色管理',
                auth: true,
                collapseVar: 5,
                state: 'dashboard.role',
                icon: ''
            }
        ]
    }, {
        name: '数据统计',
        auth: $rootScope.perms(9),
        collapseVar: 9,
        state: '',
        states: ['dashboard.materialchart', 'dashboard.income', 'dashboard.terminalchart','dashboard.authIncome'],
        icon: 'fa fa-tasks fa-fw',
        children: [{
                name: '终端统计',
                auth: true,
                collapseVar: 9,
                state: 'dashboard.terminalchart',
                icon: ''
            }, {
                name: '内容统计',
                auth: true,
                collapseVar: 9,
                state: 'dashboard.materialchart',
                icon: ''
            },
            {
                name: '商户账目',
                auth: $rootScope.perms(92),
                collapseVar: 9,
                state: 'dashboard.income',
                icon: ''
            },
            {
                name: '授权码账目',
                auth: $rootScope.perms(93),
                collapseVar: 9,
                state: 'dashboard.authIncome',
                icon: ''
            }
        ]
    }, {
        name: '模板管理',
        auth: $rootScope.perms(8),
        collapseVar: 8,
        state: '',
        states: ['dashboard.material', 'dashboard.temp'],
        icon: 'icon iconfont icon-mobanguanli',
        children: [{
                name: '素材管理',
                auth: $rootScope.perms(81),
                collapseVar: 8,
                state: 'dashboard.material',
                icon: ''
            },
            {
                name: '模板管理',
                auth: $rootScope.perms(82),
                collapseVar: 8,
                state: 'dashboard.templateList',
                icon: ''
            }
        ]
    }, {
        name: '操作日志',
        auth: $rootScope.perms(7),
        collapseVar: 7,
        state: '',
        states: ['dashboard.terminalcommand', 'dashboard.terminalmigrate','dashboard.terminalcharge'],
        icon: 'icon iconfont icon-rizhiguanli',
        children: [{
                name: '操作日志',
                auth: $rootScope.perms(71),
                collapseVar: 7,
                state: 'dashboard.terminalcommand',
                icon: ''
            },
            {
                name: '终端迁移记录',
                auth: $rootScope.perms(72),
                collapseVar: 7,
                state: 'dashboard.terminalmigrate',
                icon: ''
            },
            {
                name: '终端日期变动',
                auth: $rootScope.perms(73),
                collapseVar: 7,
                state: 'dashboard.terminalcharge',
                icon: ''
            }
        ]
    }]

    $scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
        $scope.state = toState.name;
        for (let i = 0; i < $scope.menuList.length; i++) {
            if ($scope.menuList[i].states.indexOf($scope.state) != -1) {
                $scope.collapseVar = $scope.menuList[i].collapseVar;
            }
        }
        if (toState.name == 'dashboard.templateAdd' || toState.name == 'dashboard.templateEdit') {
            $('body').addClass('mini-navbar');
        } else {
            if (fromState.name == 'dashboard.templateAdd' || toState.name == 'dashboard.templateEdit') {
                if ($('body').hasClass('mini-navbar')) {
                    $('body').removeClass('mini-navbar')
                }
            }
        }
    })
    $scope.toggleMenu = (menu) => {
        if (menu.state != '') {
            baseService.goToState(menu.state);
        }
        if (menu.collapseVar == $scope.collapseVar)
            $scope.collapseVar = '';
        else {
            $scope.collapseVar = menu.collapseVar;
        }
    }
}
controller.$inject = ['$rootScope', '$scope', '$state', 'baseService'];

export default app => {
    app.directive('siderBar', () => {

        return {
            restrict: 'E',
            replace: true,
            template: template,
            controller: controller
        }
    })
};