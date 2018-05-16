var tplHtml = require('./editorControlBorderStyle.html');

module.exports = function (app) {

    app.directive('editorControlBorderStyle', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                borderStyle: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                $scope.styles = [
                    {name: "实线", value: "solid"},
                    {name: "虚线", value: "dashed"},
                    {name: "点线", value: "dotted"},
                    {name: "双线", value: "double"},
                    {name: "凹槽", value: "groove"},
                    {name: "凸起", value: "ridge"}
                ];

                var nowVal = null;

                var watcher = $scope.$watch('borderStyle', function (val) {
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
