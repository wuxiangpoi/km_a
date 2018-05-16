var tplHtml = require('./editorControlFont.html');

module.exports = function (app) {

    app.directive('editorControlFont', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                font: '=',
                onChange: '&'
            },
            controller: ['$scope', 'editorFontFamilyConstant', function ($scope, fonts) {
                $scope.fonts = fonts;

                var nowVal = null;

                var watcher = $scope.$watch('font', function (val) {
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
