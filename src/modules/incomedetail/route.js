import angular from 'angular';
import style from './style.less';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.incomedetail',
            url: '/incomedetail/{id}',
            template: require('./template.html'),
            info: '数据统计|账目详情',
            controller: 'incomedetailController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let incomedetailModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'incomedetailModule'
                            });
                            resolve(incomedetailModule);
                        });
                    })
                }]
            }
        });
    }])
}