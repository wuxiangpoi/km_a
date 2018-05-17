import template from './template.html'
import style from './style.less'

export default app => {
    app.directive('kmAudio', ['baseService', '$rootScope',(baseService, $rootScope) => {
        let link = ($scope, element, attrs) => {
            $scope.$watch(attrs['audiodata'], function () {
                var option = $scope.$eval(attrs['audiodata']);
                if (angular.isObject(option)) {
                    $scope.url = option.path;
                    $scope.name = option.name;
                }
            }, true);
        }
        return {
            restrict: 'AE',
            replace: true,
            template: template,
            link: link
        }
    }])
};
