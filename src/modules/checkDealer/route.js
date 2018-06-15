import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.checkDealer',
            url: '/checkDealer',
            template: require('./template.html'),
            controller: 'checkDealerController',
            info: '审核管理|商户审核',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let checkDealerModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'checkDealerModule'
                            });
                            resolve(checkDealerModule);
                        });
                    })
                }]
            }
        });
    }])
}