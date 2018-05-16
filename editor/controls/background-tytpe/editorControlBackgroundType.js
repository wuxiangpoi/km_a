var tplHtml = require('./editorControlBackgroundType.html');

module.exports = function (app) {

    app.directive('editorControlBackgroundType', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                backGroundType: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                //背景图片类型
                $scope.items = [
                    {name: "无", value: 0},
                    {name: "颜色", value: 1},
                    {name: "图片", value: 2}
                ];

                $scope.changeVal = function (i) {
                    if (i.value !== $scope.backGroundType) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: i.value,
                                oldVal: $scope.backGroundType
                            });
                        }
                        $scope.backGroundType = i.value;
                    }
                };
            }]
        };
    });

};
