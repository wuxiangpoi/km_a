var tplHtml = require('./editorElementTime.html');

module.exports = function (app) {

    app.directive('editorElementTime', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
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
                    timer = null;
                });
            }]
        };
    });

};
