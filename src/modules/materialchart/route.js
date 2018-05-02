import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.materialchart',
            url: '/materialchart',
            template: require('./template.html'),
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