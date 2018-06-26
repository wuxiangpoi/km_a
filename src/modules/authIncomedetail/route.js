import angular from 'angular';
import style from './style.less';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.authIncomedetail',
            url: '/authIncomedetail/{id}',
            template: require('./template.html'),
            info: '数据统计|授权码账目详情',
            controller: 'authIncomedetailController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let authIncomedetailModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'authIncomedetailModule'
                            });
                            resolve(authIncomedetailModule);
                        });
                    })
                }]
            }
        });
    }])
}