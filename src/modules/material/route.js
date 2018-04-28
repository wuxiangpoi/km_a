import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.material',
            url: '/material',
            template: require('./template.html'),
            controller: 'materialController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let materialModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'materialModule'
                            });
                            resolve(materialModule);
                        });
                    })
                }]
            }
        });
    }])
}