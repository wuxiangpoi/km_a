import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.terminal',
            url: '/terminal/{domain}',
            info: '终端管理',
            template: require('./template.html'),
            controller: 'terminalController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let terminalModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'terminalModule'
                            });
                            resolve(terminalModule);
                        });
                    })
                }]
            }
        });
    }])
}