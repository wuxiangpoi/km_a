import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.terminalcharge',
            url: '/terminalcharge',
            template: require('./template.html'),
            info: '操作日志|终端日期变动',
            controller: 'terminalchargeController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let terminalchargeModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'terminalchargeModule'
                            });
                            resolve(terminalchargeModule);
                        });
                    })
                }]
            }
        });
    }])
}