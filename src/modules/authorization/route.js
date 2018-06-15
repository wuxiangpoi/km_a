import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.authorization',
            url: '/authorization',
            template: require('./template.html'),
            controller: 'authorizationController',
            info: '授权管理|授权码管理',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let authorizationModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'authorizationModule'
                            });
                            resolve(authorizationModule);
                        });
                    })
                }]
            }
        });
    }])
}