import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.boardDealer',
            url: '/boardDealer',
            template: require('./template.html'),
            controller: 'boardDealerController',
            info: '授权管理|板卡商管理',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let boardDealerModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'boardDealerModule'
                            });
                            resolve(boardDealerModule);
                        });
                    })
                }]
            }
        });
    }])
}