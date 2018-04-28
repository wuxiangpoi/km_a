import angular from 'angular';
import template from './template.html';

import './style.less';

export default app => {
    app.directive('kmSelect', (baseService) => {
        let link = ($scope, element, attrs) => {
            $scope.valueName = attrs['val'];
            $scope.labelName = attrs['name'];
            $scope.select = function (item) {
                $scope.selectedItem = item;
                $scope.selected = item[$scope.valueName];
                setTimeout(function(){
                    $scope.$apply(function(){
                        $scope.change();
                    })
                },0)
                
            }
        }
        return {
            restrict: 'AE',
            replace: true,
            template: template,
            link: link,
            scope: {
                options: '=',
                selected: '=',
                change: '='
            }

        }
    })
};