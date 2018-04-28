import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard',
            url: '/dashboard',
            template: require('./template.html'),
            controller: 'dashboardController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let dashboardModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'dashboardModule'
                            });
                            resolve(dashboardModule);
                        });
                    })
                }]
            }
        });
    }])
}