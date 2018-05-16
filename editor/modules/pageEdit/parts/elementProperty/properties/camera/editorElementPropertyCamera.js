var find = require('../../../../../../../libs/array').find;

var tplHtml = require('./editorElementPropertyCamera.html');

module.exports = function (app) {

    app.directive('editorElementPropertyCamera', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '='
            },
            controller: ['$scope', 'editorRedoUndoService', 'editorBrandsConstant', function ($scope, editorRedoUndoService, editorBrandsConstant) {
                console.log($scope.data);

                $scope.brandChange = function (newVal, oldVal) {
                    console.log(newVal, oldVal);
                };

                $scope.codeChange = function (newVal, oldVal) {
                    console.log(newVal, oldVal);
                };

                var watcher = $scope.$watch('data', function (newData) {
                    var obj = find(editorBrandsConstant, function (item) {
                        return item.value === newData.brand;
                    });
                    $scope.data.url = obj.getUrl(newData);
                    console.log($scope.data);
                }, true);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }]
        };
    });

};
