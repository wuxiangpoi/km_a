import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.income',
            url: '/income',
            template: require('./template.html'),
            controller: 'incomeController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let incomeModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'incomeModule'
                            });
                            resolve(incomeModule);
                        });
                    })
                }]
            }
        });
    }])
}