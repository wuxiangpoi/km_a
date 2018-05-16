var CycleQueue = require('../../../libs/cyclequeue');

var tplHtml = require('./dmbdProgramPreview2.html');

module.exports = function (app) {

    //节目预览组件2
    app.directive('dmbdProgramPreview2', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                programPixelHorizontal: '=',//节目像素宽度
                programPixelVertical: '=',//节目像素高度
                programPages: '=',//节目内容
                size: '='//预览区域尺寸（正方形）
            },
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                $scope.size = $scope.size || 500;
                var cycle = new CycleQueue($scope.programPages);
                var timer = null;

                function playNext() {
                    var nextPage = cycle.skipNext();
                    $scope.currentPage = nextPage;
                    timer = $timeout(playNext, nextPage.stay * 1000);
                }

                function allPlaying() {
                    $scope.isPreviewAll = true;
                    playNext();
                }

                allPlaying();

                $scope.previewAll = function () {
                    if (timer === null) {
                        allPlaying();
                    }
                };

                $scope.curPageIndex = 0;

                $scope.previewPage = function (page, $event) {
                    if (timer !== null) {
                        $timeout.cancel(timer);
                        timer = null;
                    }
                    $scope.currentPage = page;
                    $scope.isPreviewAll = false;
                    $scope.curPageIndex = $scope.programPages.indexOf(page);

                    //尽量将当前导航标签滚动到中央
                    var dom = angular.element('#' + $scope.domID).get(0);
                    var domWidth = dom.clientWidth;
                    var parentWidth = dom.parentNode.clientWidth;
                    var eachNavWidth = domWidth / $scope.programPages.length;
                    var curNavLeft = eachNavWidth * ($scope.curPageIndex + 0.5);
                    var curNavRight = domWidth - curNavLeft;
                    if (curNavLeft > parentWidth / 2) {
                        if (curNavRight > parentWidth / 2) {
                            offsetLeft = curNavLeft - parentWidth / 2;
                        } else {
                            offsetLeft = domWidth - parentWidth;
                        }
                    } else {
                        offsetLeft = 0;
                    }
                    setTranslateX(dom, offsetLeft);
                    setDisabled(offsetLeft, domWidth, parentWidth);
                };

                //销毁时清除
                $scope.$on('$destroy', function () {
                    if (timer !== null) {
                        $timeout.cancel(timer);
                        timer = null;
                    }
                });

                //导航滑动
                var offsetLeft = 0;

                //随机生成ID以免重复
                $scope.domID = 'nav-items-' + Math.ceil(Math.random() * 1000000);

                function setTranslateX(dom, offsetLeft) {
                    dom.style.webkitTransform
                        = dom.style.mozTransform
                        = dom.style.msTransform
                        = dom.style.oTransform
                        = dom.style.transform
                        = 'translateX(-' + offsetLeft + 'px)';
                }

                $scope.navToPrev = function ($event) {
                    var dom = angular.element('#' + $scope.domID).get(0);
                    var domWidth = dom.clientWidth;
                    var parentWidth = dom.parentNode.clientWidth;

                    if (offsetLeft > parentWidth) {
                        offsetLeft -= parentWidth;
                    } else {
                        offsetLeft = 0;
                    }
                    setTranslateX(dom, offsetLeft);
                    setDisabled(offsetLeft, domWidth, parentWidth);
                };

                $scope.navToNext = function ($event) {
                    var dom = angular.element('#' + $scope.domID).get(0);
                    var domWidth = dom.clientWidth;
                    var parentWidth = dom.parentNode.clientWidth;

                    if (offsetLeft < domWidth - 2 * parentWidth) {
                        offsetLeft += parentWidth;
                    } else {
                        offsetLeft = domWidth - parentWidth;
                    }
                    setTranslateX(dom, offsetLeft);
                    setDisabled(offsetLeft, domWidth, parentWidth);
                };

                if ($scope.programPages.length > 1) {
                    var timer22 = window.setTimeout(function () {
                        var dom = angular.element('#' + $scope.domID).get(0);
                        var domWidth = dom.clientWidth;
                        var parentWidth = dom.parentNode.clientWidth;

                        $scope.$apply(function () {
                            setDisabled(offsetLeft, domWidth, parentWidth);
                        });

                    }, 0);
                }

                function setDisabled(offsetLeft, domWidth, parentWidth) {
                    $scope.isLeftDisabled = offsetLeft <= 0;
                    $scope.isRightDisabled = offsetLeft + parentWidth >= domWidth;
                }

                //销毁时清除
                $scope.$on('$destroy', function () {
                    if (timer22 !== null) {
                        window.clearTimeout(timer22);
                    }
                });

                //全屏
                (function () {
                    $scope.isFullScreen = false;

                    function fullscreen(isFull) {
                        $scope.$apply(function () {
                            $scope.isFullScreen = isFull;
                            $scope.$broadcast('resize');
                        });
                    }

                    function fullscreenchange() {
                        fullscreen(document.fullscreen);
                    }

                    function webkitfullscreenchange() {
                        fullscreen(document.webkitIsFullScreen);
                    }

                    function mozfullscreenchange() {
                        fullscreen(document.mozFullScreen);
                    }

                    function msfullscreenchange() {
                        fullscreen(document.msFullscreenElement);
                    }

                    document.addEventListener('fullscreenchange', fullscreenchange, false);
                    document.addEventListener('webkitfullscreenchange', webkitfullscreenchange, false);
                    document.addEventListener('mozfullscreenchange', mozfullscreenchange, false);
                    document.addEventListener('msfullscreenchange', msfullscreenchange, false);

                    //销毁时清除
                    $scope.$on('$destroy', function () {
                        document.removeEventListener('fullscreenchange', fullscreenchange, false);
                        document.removeEventListener('webkitfullscreenchange', webkitfullscreenchange, false);
                        document.removeEventListener('mozfullscreenchange', mozfullscreenchange, false);
                        document.removeEventListener('msfullscreenchange', msfullscreenchange, false);
                    });

                    //全屏
                    $scope.requestFullScreen = function ($event) {
                        var node = $event.target.parentNode;
                        var requestFullScreen = node.requestFullScreen
                            || node.webkitRequestFullScreen
                            || node.mozRequestFullScreen
                            || node.msRequestFullScreen;

                        if (requestFullScreen) {
                            requestFullScreen.call(node);
                        } else if (typeof ActiveXObject !== 'undefined') {
                            var wscript = new ActiveXObject('WScript.Shell');
                            wscript.SendKeys("{F11}");
                        }
                        $scope.isFullScreen = true;
                    };

                    //取消全屏
                    $scope.cancelFullScreen = function ($event) {
                        var cancelFullScreen = document.cancelFullScreen
                            || document.webkitCancelFullScreen
                            || document.mozCancelFullScreen
                            || document.exitFullScreen;

                        if (cancelFullScreen) {
                            cancelFullScreen.call(document);
                        } else if (typeof ActiveXObject !== 'undefined') {
                            var wscript = new ActiveXObject('WScript.Shell');
                            wscript.SendKeys("{F11}");
                        }
                        $scope.isFullScreen = false;
                    };

                })();

            }]
        };
    });

};