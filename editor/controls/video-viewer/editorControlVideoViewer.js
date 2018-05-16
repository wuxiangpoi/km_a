var tplHtml = require('./editorControlVideoViewer.html');

module.exports = function (app) {

    app.directive('editorControlVideoViewer', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                poster: '=',
                src: '='
            },
            link: function (scope, elements, attrs) {
                var endedHandler = function () {
                    scope.$apply(function () {
                        scope.isPlaying = false;
                    });
                };
                var videoDOM = elements.find('video')[0];
                videoDOM.addEventListener('ended', endedHandler);

                //销毁时移除事件
                scope.$on('$destroy', function () {
                    videoDOM.removeEventListener('ended', endedHandler);
                });

                videoDOM.poster = scope.poster;
                scope.isLoaded = false;//指示视频资源是否已加载
                scope.isPlaying = false;//指示是否正在播放

                scope.loadVideo = function () {
                    videoDOM.src = scope.src;

                    scope.isLoaded = true;
                    scope.isPlaying = true;
                };

                scope.playVideo = function () {
                    videoDOM.play();
                    scope.isPlaying = true;
                };

                scope.pauseVideo = function () {
                    videoDOM.pause();
                    scope.isPlaying = false;
                };
            }
        };
    });

};
