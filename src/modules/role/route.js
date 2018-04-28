import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.role',
            url: '/role',
            template: require('./template.html'),
            controller: 'roleController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let roleModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'roleModule'
                            });
                            resolve(roleModule);
                        });
                    })
                }]
            }
        });
    }])
}