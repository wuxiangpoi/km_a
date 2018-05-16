var tplHtml = require('./videoViewer2.html');

module.exports = function (app) {

    //视频封面图及点击播放（加强版）
    app.directive('dmbdVideoViewer2', ['dmbdOSSImageUrlResizeFilterFilter', function (dmbdOSSImageUrlResizeFilter) {
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
                    var videoDOM = elements.find('video')[0];
                    videoDOM.addEventListener('ended', endedHandler);

                    //销毁时移除事件
                    scope.$on('$destroy', function () {
                        videoDOM.removeEventListener('ended', endedHandler);
                    });

                    videoDOM.poster = dmbdOSSImageUrlResizeFilter(scope.data.snapshot, 200);
                    scope.isLoaded = false;//指示视频资源是否已加载
                    scope.isPlaying = false;//指示是否正在播放

                    scope.loadVideo = function ($event) {
                        $event.stopPropagation();
                        videoDOM.src = scope.data.url;

                        scope.isLoaded = true;
                        scope.isPlaying = true;
                    };

                    scope.playVideo = function ($event) {
                        $event.stopPropagation();
                        videoDOM.play();
                        scope.isPlaying = true;
                    };

                    scope.pauseVideo = function ($event) {
                        $event.stopPropagation();
                        videoDOM.pause();
                        scope.isPlaying = false;
                    };

                    scope.selectVideo = function ($event) {
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
    }]);

};