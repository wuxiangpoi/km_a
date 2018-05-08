import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.versionfile',
            url: '/versionfile',
            template: require('./template.html'),
            controller: 'versionfileController',
            info: '系统管理|版本文件管理',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let versionfileModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'versionfileModule'
                            });
                            resolve(versionfileModule);
                        });
                    })
                }]
            }
        });
    }])
}