var tplHtml = require('./editorElementPropertyImage.html');

module.exports = function (app) {

    app.directive('editorElementPropertyImage', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {

                $scope.imageChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.image = newVal;
                    }, function () {
                        data.image = oldVal;
                    }, $scope);
                };

            }]
        };
    });

};
