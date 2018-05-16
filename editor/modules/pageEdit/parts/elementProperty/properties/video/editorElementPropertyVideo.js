var tplHtml = require('./editorElementPropertyVideo.html');

module.exports = function (app) {

    app.directive('editorElementPropertyVideo', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {

                //当视频变化时
                $scope.videoChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.video = newVal;
                    }, function () {
                        data.video = oldVal;
                    }, $scope);
                };

            }]
        };
    });

};
