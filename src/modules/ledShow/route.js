import angular from 'angular';
import style from './style.less';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'ledShow',
            url: '/ledShow',
            template: require('./template.html'),
            info: '大屏',
            controller: 'ledShowController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let ledShowModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'ledShowModule'
                            });
                            resolve(ledShowModule);
                        });
                    })
                }]
            }
        });
    }])
}