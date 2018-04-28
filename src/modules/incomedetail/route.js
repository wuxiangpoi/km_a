import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.incomedetail',
            url: '/incomedetail/:id',
            template: require('./template.html'),
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