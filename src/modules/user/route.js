import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.user',
            url: '/user',
            template: require('./template.html'),
            controller: 'userController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let userModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'userModule'
                            });
                            resolve(userModule);
                        });
                    })
                }]
            }
        });
    }])
}