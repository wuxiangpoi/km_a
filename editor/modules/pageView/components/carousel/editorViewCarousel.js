var find = require('../../../../../libs/array').find;

var tplHtml = require('./editorViewCarousel.html');

module.exports = function (app) {

    //页面预览指令
    app.directive('editorViewCarousel', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                data: '='
            },
            controller: ['$scope', '$timeout', function ($scope, $timeout) {

                if (typeof $scope.data.disableAnimation === 'undefined') {
                    $scope.data.disableAnimation = false;
                }

                $scope.prevIndex = $scope.data.images.length - 1;
                $scope.nextIndex = 0;

                var inAnims = [
                    {id: 1, name: "右入", value: "right-slide-in"},
                    {id: 2, name: "左入", value: "left-slide-in"},
                    {id: 3, name: "上入", value: "top-slide-in"},
                    {id: 4, name: "下入", value: "bottom-slide-in"},
                    {id: 5, name: "淡入", value: "fade-in"},
                    {id: 6, name: "旋入", value: "rotateY-in"}
                ];
                var outAnims = [
                    {id: 1, name: "左出", value: "left-slide-out"},
                    {id: 2, name: "右出", value: "right-slide-out"},
                    {id: 3, name: "下出", value: "bottom-slide-out"},
                    {id: 4, name: "上出", value: "top-slide-out"},
                    {id: 5, name: "淡出", value: "fade-out"},
                    {id: 6, name: "旋出", value: "rotateY-out"}
                ];

                function doChangeWithAnimation() {
                    var inAnim = find(inAnims, function (item) {
                        return item.id === $scope.data.animation.inId;
                    });

                    var outAnim = find(outAnims, function (item) {
                        return item.id === $scope.data.animation.outId;
                    });

                    $scope.inAnimation = inAnim ? inAnim.value : inAnims[0].value;//进场动画
                    $scope.outAnimation = outAnim ? outAnim.value : outAnims[0].value;//出场动画

                    var imageCount = $scope.data.images.length;
                    if (imageCount === 0) {
                        $scope.prevIndex = -1;
                        $scope.nextIndex = 0;
                    } else {
                        $scope.prevIndex = $scope.nextIndex;
                        $scope.nextIndex = ($scope.nextIndex + 1) % imageCount;
                    }
                }

                doChangeWithAnimation();

                var timer = createTimerWithAnimation();

                function createTimerWithAnimation() {
                    return $timeout(function playingNext() {

                        doChangeWithAnimation();

                        timer = $timeout(playingNext, getInterval());

                    }, getInterval());
                }

                function getInterval() {
                    return $scope.data.stay * 1000 + ($scope.data.disableAnimation ? 0 : $scope.data.duration);
                }

                var watcher = $scope.$watchGroup(['data.stay', 'data.duration', 'data.disableAnimation'], function (args) {
                    $timeout.cancel(timer);
                    doChangeWithAnimation();
                    timer = createTimerWithAnimation();
                });

                var watcherAnimation = $scope.$watch('data.animation', function (animation) {
                    $timeout.cancel(timer);
                    doChangeWithAnimation();
                    timer = createTimerWithAnimation();
                }, true);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                    watcherAnimation();
                    $timeout.cancel(timer);
                });

            }],
            link: function (scope, elements, attrs) {
                var maxPixel = scope.pixelHorizontal > scope.pixelVertical ? scope.pixelHorizontal : scope.pixelVertical;
                var dom = elements.get(0);
                dom.style.webkitPerspective
                    = dom.style.mozPerspective
                    = dom.style.perspective
                    = maxPixel + 'px';
            }
        };
    });

};
