var tplHtml = require('./editorControlIsMultiple.html');

module.exports = function (app) {

    app.directive('editorControlIsMultiple', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                isMultiple: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                //单行/多行
                $scope.items = [
                    {name: "单行", value: false},
                    {name: "多行", value: true}
                ];

                $scope.changeVal = function (i) {
                    if (i.value !== $scope.isMultiple) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: i.value,
                                oldVal: $scope.isMultiple
                            });
                        }
                        $scope.isMultiple = i.value;
                    }
                };
            }]
        };
    });

};
