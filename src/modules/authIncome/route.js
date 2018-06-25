import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.authIncome',
            url: '/authIncome',
            template: require('./template.html'),
            controller: 'authIncomeController',
            info: '授权管理|授权码账目',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let authIncomeModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'authIncomeModule'
                            });
                            resolve(authIncomeModule);
                        });
                    })
                }]
            }
        });
    }])
}