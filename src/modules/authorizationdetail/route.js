import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.authorizationdetail',
            url: '/authorizationdetail/{id}',
            template: require('./template.html'),
            controller: 'authorizationdetailController',
            info: '授权管理|授权码详情',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let authorizationdetailModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'authorizationdetailModule'
                            });
                            resolve(authorizationdetailModule);
                        });
                    })
                }]
            }
        });
    }])
}