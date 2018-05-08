import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.checkModel',
            url: '/checkModel',
            template: require('./template.html'),
            controller: 'checkModelController',
            info: '审核管理',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let checkModelModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'checkModelModule'
                            });
                            resolve(checkModelModule);
                        });
                    })
                }]
            }
        });
    }])
}