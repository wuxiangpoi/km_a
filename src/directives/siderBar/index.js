import angular from 'angular';
import template from './template.html';
import style from './style.less';

let controller = ($scope,$state,baseService) => {
    $scope.collapseVar = '';
    $scope.state = '';
    $scope.menuList = [{
        name: '首页',
        auth: '',
        collapseVar: 0,
        state: 'dashboard.home',
        states: ['dashboard.home'],
        icon: 'iconfont icon-shouye'
    },{
        name: '系统管理',
        auth: '',
        collapseVar: 1,
        icon: 'fa fa-cogs fa-fw',
        state: '',
        states: ['dashboard.dictionary','dashboard.versionfile'],
        children: [
            {
                name: '数据字典',
                auth: '',
                collapseVar: 1,
                state: 'dashboard.dictionary',
                icon: ''
            },
            {
                name: '版本文件管理',
                auth: '',
                collapseVar: 1,
                state: 'dashboard.versionfile',
                icon: ''
            }
        ]
    },{
        name: '企业管理',
        auth: 2,
        collapseVar: 2,
        state: 'dashboard.domain',
        states: ['dashboard.domain'],
        icon: 'fa fa-suitcase'
    },{
        name: '终端管理',
        auth: 3,
        collapseVar: 3,
        state: 'dashboard.terminalreport',
        states: ['dashboard.terminalreport'],
        icon: 'iconfont icon-zhongduanguanli'
    },{
        name: '审核管理',
        auth: 4,
        collapseVar: 4,
        state: 'dashboard.checkModel',
        states: ['dashboard.checkModel'],
        icon: 'iconfont icon-shenheguanli'
    },{
        name: '账户管理',
        auth: 5,
        collapseVar: 5,
        state: '',
        states: ['dashboard.user','dashboard.role'],
        icon: 'iconfont icon-zhanghuguanli',
        children: [
            {
                name: '账号管理',
                auth: '',
                collapseVar: 5,
                state: 'dashboard.user',
                icon: ''
            },
            {
                name: '角色管理',
                auth: '',
                collapseVar: 5,
                state: 'dashboard.role',
                icon: ''
            }
        ]
    },{
        name: '数据统计',
        auth: 6,
        collapseVar: 6,
        state: '',
        states: ['dashboard.materialchart','dashboard.income'],
        icon: 'fa fa-tasks fa-fw',
        children: [
            {
                name: '内容统计',
                auth: '',
                collapseVar: 6,
                state: 'dashboard.materialchart',
                icon: ''
            },
            {
                name: '账目统计',
                auth: '',
                collapseVar: 6,
                state: 'dashboard.income',
                icon: ''
            }
        ]
    },{
        name: '模版管理',
        auth: 8,
        collapseVar: 8,
        state: '',
        states: ['dashboard.material','dashboard.temp'],
        icon: 'icon iconfont icon-mobanguanli',
        children: [
            {
                name: '素材管理',
                auth: '',
                collapseVar: 8,
                state: 'dashboard.material',
                icon: ''
            },
            {
                name: '模版管理',
                auth: '',
                collapseVar: 8,
                state: 'dashboard.income',
                icon: ''
            }
        ]
    },{
        name: '操作日志',
        auth: 7,
        collapseVar: 7,
        state: '',
        states: ['dashboard.terminalcommand','dashboard.terminalmigrate'],
        icon: 'icon iconfont icon-rizhiguanli',
        children: [
            {
                name: '操作日志',
                auth: '',
                collapseVar: 7,
                state: 'dashboard.terminalcommand',
                icon: ''
            },
            {
                name: '终端迁移记录',
                auth: '',
                collapseVar: 7,
                state: 'dashboard.terminalmigrate',
                icon: ''
            }
        ]
    }]
    $scope.$on('$stateChangeSuccess',(event, toState, toParams, fromState, fromParams)=>{
        $scope.state = toState.name;
    })
    $scope.toggleMenu = (menu) => {
        if(menu.state != ''){
            baseService.goToState(menu.state);
        }
        if (menu.collapseVar == $scope.collapseVar)
            $scope.collapseVar = '';
          else {
            $scope.collapseVar = menu.collapseVar;
          }
    }
}
controller.$inject = ['$scope','$state','baseService'];

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