var tplHtml = require('./editorControlTextArea.html');

module.exports = function (app) {

    app.directive('editorControlTextArea', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                value: '=',
                placeholder: '@',
                rows: '@',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {

                var watcher = $scope.$watch('value', function (newVal) {
                    $scope.val = newVal;
                });

                //销毁时移除事件
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

                //失去焦点
                $scope.onBlur = function (val) {
                    if (val !== $scope.value) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: val,
                                oldVal: $scope.value
                            });
                        }
                        $scope.value = val;
                    }
                };

            }]
        };
    });

};