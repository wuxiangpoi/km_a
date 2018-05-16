var tplHtml = require('./editorControlDirectionHorizontal.html');

module.exports = function (app) {

    app.directive('editorControlDirectionHorizontal', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                direction: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                //水平方向
                $scope.directions = [
                    {name: "向左", icon: 'icon-xiangzuo', value: true},
                    {name: "向右", icon: 'icon-xiangyou', value: false}
                ];

                $scope.changeDirection = function (direction) {
                    if (direction.value !== $scope.direction) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: direction.value,
                                oldVal: $scope.direction
                            });
                        }
                        $scope.direction = direction.value;
                    }
                };
            }]
        };
    });

};
