import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'login',
            url: '/login',
            template: require('./template.html'),
            controller: 'loginController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require('./style.less');
                        require.ensure([], () => {
                            let loginModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'loginModule'
                            });
                            resolve(loginModule);
                        });
                    })
                }]
            }
        });
    }])
}