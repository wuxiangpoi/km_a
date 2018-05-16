var tplHtml = require('./editorViewCamera.html');

module.exports = function (app) {

    //页面预览指令
    app.directive('editorViewCamera', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                data: '='
            },
            controller: ['$scope', function ($scope) {
                var maxPixel = $scope.pixelHorizontal > $scope.pixelVertical ? $scope.pixelHorizontal : $scope.pixelVertical;
                $scope.fontSize = 25 * maxPixel / 1000;
            }],
            link: function (scope, elements, attrs) {
                scope.videoID = 'stream_video_' + Math.ceil(Math.random() * 100000);

                var player = null;
                var timer = window.setTimeout(function () {
                    player = videojs(scope.videoID);
                    player.play();
                }, 0);

                scope.$on('$destroy', function () {
                    if (timer !== null) {
                        window.clearTimeout(timer);
                    }
                    if (player !== null) {
                        player.dispose();
                    }
                });
            }
        };
    });

};