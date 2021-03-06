import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.terminalreport',
            url: '/terminalreport',
            template: require('./template.html'),
            info: '终端管理',
            controller: 'terminalreportController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let terminalreportModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'terminalreportModule'
                            });
                            resolve(terminalreportModule);
                        });
                    })
                }]
            }
        });
    }])
}