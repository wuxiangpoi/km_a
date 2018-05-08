import angular from 'angular';
import style from './style.less';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.materialchart',
            url: '/materialchart',
            template: require('./template.html'),
            info: '数据统计|内容统计',
            controller: 'materialchartController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let materialchartModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'materialchartModule'
                            });
                            resolve(materialchartModule);
                        });
                    })
                }]
            }
        });
    }])
}