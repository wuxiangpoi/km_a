var tplHtml = require('./editorControlTimeFormatter.html');

module.exports = function (app) {

    app.directive('editorControlTimeFormatter', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                formatter: '=',
                onChange: '&'
            },
            controller: ['$scope', 'editorTimeFormatConstant', function ($scope, formatters) {
                $scope.formatters = formatters;

                var nowVal = null;

                var watcher = $scope.$watch('formatter', function (val) {
                    nowVal = val;
                });

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

                $scope.changeVal = function (newVal) {
                    if ($scope.onChange) {
                        $scope.onChange({
                            oldVal: nowVal,
                            newVal: newVal
                        });
                    }
                    nowVal = newVal;
                };
            }]
        };
    });

};
