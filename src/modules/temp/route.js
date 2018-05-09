import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.temp',
            url: '/temp',
            template: require('./template.html'),
            info: '操作日志',
            controller: 'tempController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let tempModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'tempModule'
                            });
                            resolve(tempModule);
                        });
                    })
                }]
            }
        });
    }])
}