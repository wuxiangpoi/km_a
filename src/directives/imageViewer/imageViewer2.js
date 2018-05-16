var tplHtml = require('./imageViewer2.html');

module.exports = function (app) {

    //图片选择（加强版）
    app.directive('dmbdImageViewer2', function () {
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

                scope.selectImage = function ($event) {
                    $event.stopPropagation();
                    scope.onButtonClick();
                };

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