import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.domain',
            url: '/domain',
            template: require('./template.html'),
            controller: 'domainController',
            info: '企业管理',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let domainModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'domainModule'
                            });
                            resolve(domainModule);
                        });
                    })
                }]
            }
        });
    }])
}