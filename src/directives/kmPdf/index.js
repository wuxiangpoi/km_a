import template from './template.html'
import style from './style.less'

export default app => {
    app.directive('kmPdf', ['baseService', '$rootScope',(baseService, $rootScope) => {
        let link = ($scope, element, attrs) => {
            $scope.$watch(attrs['pdfdata'], function () {
                var option = $scope.$eval(attrs['pdfdata']);
                $('a.media').media({width:$(element[0]).width(), height:$(element[0]).height()});
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
