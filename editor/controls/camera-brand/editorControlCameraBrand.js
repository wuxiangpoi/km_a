var tplHtml = require('./editorControlCameraBrand.html');

module.exports = function (app) {

    app.directive('editorControlCameraBrand', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                brand: '=',
                onChange: '&'
            },
            controller: ['$scope', 'editorBrandsConstant', function ($scope, editorBrandsConstant) {
                $scope.brands = editorBrandsConstant;

                var nowVal = null;

                var watcher = $scope.$watch('brand', function (val) {
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
