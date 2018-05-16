var tplHtml = require('./audioViewer2.html');

module.exports = function (app) {

    //音频封面图及点击播放（加强版）
    app.directive('dmbdAudioViewer2', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '=',
                buttonText: '@',
                onButtonClick: '&'
            },
            link: function (scope, elements, attrs) {
                //播放控制
                (function () {
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

                    //audioDOM.poster = scope.data.snapshot;
                    scope.isLoaded = false;//指示视频资源是否已加载
                    scope.isPlaying = false;//指示是否正在播放

                    scope.loadAudio = function ($event) {
                        $event.stopPropagation();
                        audioDOM.src = scope.data.url;

                        scope.isLoaded = true;
                        scope.isPlaying = true;
                    };

                    scope.playAudio = function ($event) {
                        $event.stopPropagation();
                        audioDOM.play();
                        scope.isPlaying = true;
                    };

                    scope.pauseAudio = function ($event) {
                        $event.stopPropagation();
                        audioDOM.pause();
                        scope.isPlaying = false;
                    };

                    scope.selectAudio = function ($event) {
                        $event.stopPropagation();
                        scope.onButtonClick();
                    };
                })();

                //更多
                (function () {
                    scope.isMoreDown = false;//更多按钮是否被按下
                    scope.isShowMore = false;//显示更多开关

                    scope.mouseClick = function ($event) {
                        $event.stopPropagation();
                        scope.isMoreDown = !scope.isMoreDown;
                        scope.isShowMore = scope.isMoreDown;
                    };

                    scope.mouseEnter = function ($event) {
                        $event.stopPropagation();
                        if (!scope.isMoreDown) {
                            scope.isShowMore = true;
                        }
                    };

                    scope.mouseLeave = function ($event) {
                        $event.stopPropagation();
                        if (!scope.isMoreDown) {
                            scope.isShowMore = false;
                        }
                    };
                })();
            }
        };
    });

};