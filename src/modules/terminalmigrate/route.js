import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.terminalmigrate',
            url: '/terminalmigrate',
            template: require('./template.html'),
            controller: 'terminalmigrateController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let terminalmigrateModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'terminalmigrateModule'
                            });
                            resolve(terminalmigrateModule);
                        });
                    })
                }]
            }
        });
    }])
}