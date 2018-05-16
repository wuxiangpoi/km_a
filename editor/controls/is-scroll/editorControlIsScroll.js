var tplHtml = require('./editorControlIsScroll.html');

module.exports = function (app) {

    app.directive('editorControlIsScroll', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                isScroll: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                $scope.options = [
                    {name: "静止显示", value: false},
                    {name: "向左连移", value: true}
                ];

                var nowVal = null;

                var watcher = $scope.$watch('isScroll', function (val) {
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
