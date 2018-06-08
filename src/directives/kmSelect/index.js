import template from './template.html';

import './style.less';

export default app => {
    app.directive('kmSelect', ['baseService',(baseService) => {
        let link = ($scope, element, attrs) => {
            $scope.valueName = attrs['val'];
            $scope.labelName = attrs['name'];
            if($scope.selected != '' && $scope.options){
                for(let i = 0; i < $scope.options.length; i ++){
                    if($scope.selected == $scope.options[i][attrs['val']]){
                        $scope.selectedItem = $scope.options[i];
                    }
                }
            }
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
    }])
};