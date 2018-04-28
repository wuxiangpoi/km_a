import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.dictionary',
            url: '/dictionary',
            template: require('./template.html'),
            controller: 'dictionaryController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let dictionaryModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'dictionaryModule'
                            });
                            resolve(dictionaryModule);
                        });
                    })
                }]
            }
        });
    }])
}