var tplHtml = require('./editorViewSerie.html');

var CycleQueue = require('../../../../../libs/cyclequeue');

module.exports = function (app) {

    //页面预览指令
    app.directive('editorViewSerie', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '='
            },
            link: function (scope, elements, attrs) {

                var videos = scope.data.videos;
                if (videos.length !== 0) {

                    var queue = new CycleQueue(videos);
                    var videoDOM = elements[0];
                    videoDOM.muted = scope.data.isMuted;
                    videoDOM.volume = 0.7;

                    onVideoPlayEnd();

                    function onVideoPlayEnd() {
                        videoDOM.src = queue.skipNext().url;
                        videoDOM.load();
                        videoDOM.play();
                    }

                    videoDOM.addEventListener('ended', onVideoPlayEnd);

                    //销毁时清除
                    scope.$on('$destroy', function () {
                        videoDOM.removeEventListener('ended', onVideoPlayEnd);
                    });
                }

            }
        };
    });

};
