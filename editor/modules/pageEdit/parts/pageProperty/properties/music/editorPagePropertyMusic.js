var tplHtml = require('./editorPagePropertyMusic.html');

module.exports = function (app) {

    app.directive('editorPagePropertyMusic', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                music: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {

                //弹窗显示音乐选择框
                $scope.openSingleMusicSelectDialog = function (music) {
                    $scope.$emit('on-select-single-audio', music, function (audio) {
                        $scope.music = audio;
                        console.log(audio);
                    });
                };

                $scope.deleteMusic = function () {
                    $scope.music = null;
                };

            }]
        };
    });

};
