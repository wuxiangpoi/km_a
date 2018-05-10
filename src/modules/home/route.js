import angular from 'angular';
import style from './style.less';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.home',
            url: '/home',
            template: require('./template.html'),
            info: '首页',
            controller: 'homeController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let homeModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'homeModule'
                            });
                            resolve(homeModule);
                        });
                    })
                }]
            }
        });
    }])
}