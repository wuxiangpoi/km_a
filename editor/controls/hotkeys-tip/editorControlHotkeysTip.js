var tplHtml = require('./editorControlHotkeysTip.html');

module.exports = function (app) {

    app.directive('editorControlHotkeysTip', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            controller: ['$scope', function ($scope) {
                $scope.isSpread = false;

                $scope.spreadChange = function ($event) {
                    $event.stopPropagation();
                    $scope.isSpread = !$scope.isSpread;
                };

                //关闭展开状态
                function closeSpread() {
                    $scope.$apply(function () {
                        $scope.isSpread = false;
                    });
                }

                document.addEventListener('click', closeSpread, false);
                //销毁时移除事件
                $scope.$on('$destroy', function () {
                    document.removeEventListener('click', closeSpread, false);
                });
            }]
        };
    });

};
