var tplHtml = require('./editorPagePropertyBasic.html');

module.exports = function (app) {

    app.directive('editorPagePropertyBasic', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                page: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {

                //当场景时长变化时
                $scope.stayChange = function (newVal, oldVal) {
                    var data = $scope.page;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.stay = newVal;
                    }, function () {
                        data.stay = oldVal;
                    }, $scope);
                };

            }]
        };
    });

};
