var tplHtml = require('./editorControlBitStream.html');

module.exports = function (app) {

    app.directive('editorControlBitStream', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                code: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                $scope.codes = [
                    {name: '主码流', value: 0},
                    {name: '子码流', value: 1}
                ];

                var nowVal = null;

                var watcher = $scope.$watch('code', function (val) {
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
