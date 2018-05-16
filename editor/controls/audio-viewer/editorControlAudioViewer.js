var tplHtml = require('./editorControlAudioViewer.html');

module.exports = function (app) {

    app.directive('editorControlAudioViewer', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                src: '='
            },
            link: function (scope, elements, attrs) {
                var endedHandler = function () {
                    scope.$apply(function () {
                        scope.isPlaying = false;
                    });
                };
                var audioDOM = elements.find('audio')[0];
                audioDOM.addEventListener('ended', endedHandler);

                //销毁时移除事件
                scope.$on('$destroy', function () {
                    audioDOM.removeEventListener('ended', endedHandler);
                });
                
                scope.isLoaded = false;//指示视频资源是否已加载
                scope.isPlaying = false;//指示是否正在播放

                scope.loadAudio = function () {
                    audioDOM.src = scope.src;

                    scope.isLoaded = true;
                    scope.isPlaying = true;
                };

                scope.playAudio = function () {
                    audioDOM.play();
                    scope.isPlaying = true;
                };

                scope.pauseAudio = function () {
                    audioDOM.pause();
                    scope.isPlaying = false;
                };
            }
        };
    });

};
