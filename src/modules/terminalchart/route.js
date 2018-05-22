import angular from 'angular';
import style from './style.less';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.terminalchart',
            url: '/terminalchart',
            template: require('./template.html'),
            info: '数据统计|终端统计',
            controller: 'terminalchartController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let terminalchartModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'terminalchartModule'
                            });
                            resolve(terminalchartModule);
                        });
                    })
                }]
            }
        });
    }])
}