import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: '404',
            url: '/404',
            template: require('./template.html'),
            controller: 'errPageController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require('./style.less');
                        require.ensure([], () => {
                            let errPageModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'errPageModule'
                            });
                            resolve(errPageModule);
                        });
                    })
                }]
            }
        });
    }])
}