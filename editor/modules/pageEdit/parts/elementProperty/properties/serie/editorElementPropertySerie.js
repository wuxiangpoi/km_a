var clear = require('../../../../../../../libs/array').clear;

var tplHtml = require('./editorElementPropertySerie.html');

module.exports = function (app) {

    app.directive('editorElementPropertySerie', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {
                //弹框选择多个视频
                $scope.showDialogForSelectMultipleVideo = function () {

                    var videos = $scope.data.videos;

                    $scope.$emit('on-select-multiple-video', videos, function (newVideos) {
                        var oldVideos = videos.slice(0);

                        editorRedoUndoService.saveAndExecRedo(function () {
                            clear(videos);//清空
                            newVideos.forEach(function (video) {
                                videos.push(video);
                            });
                        }, function () {
                            clear(videos);//清空
                            oldVideos.forEach(function (video) {
                                videos.push(video);
                            });
                        }, $scope);
                    });

                };

                //当静音开关变化时
                $scope.mutedChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.isMuted = !newVal;
                    }, function () {
                        data.isMuted = !oldVal;
                    }, $scope);
                };
            }]
        };
    });

};
