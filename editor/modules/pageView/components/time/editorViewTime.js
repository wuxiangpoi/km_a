var tplHtml = require('./editorViewTime.html');

module.exports = function (app) {

    //页面预览指令
    app.directive('editorViewTime', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                data: '='
            },
            controller: ['$scope', '$interval', function ($scope, $interval) {

                $scope.nowTime = new Date();

                var timer = $interval(function () {
                    $scope.nowTime = new Date();
                }, 997);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    $interval.cancel(timer);
                });
            }]
        };
    });

};