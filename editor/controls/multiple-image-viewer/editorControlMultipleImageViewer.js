var tplHtml = require('./editorControlMultipleImageViewer.html');

module.exports = function (app) {

    app.directive('editorControlMultipleImageViewer', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                images: '='
            },
            controller: ['$scope', function ($scope) {
                var watcher = $scope.$watchCollection('images', function (images) {
                    $scope.curIndex = -1;
                    if (images.length !== 0) {
                        $scope.curIndex = 0;
                    }
                });

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

                $scope.prevImage = function () {
                    if ($scope.curIndex > 0) {
                        $scope.curIndex -= 1;
                    }
                };

                $scope.nextImage = function () {
                    var count = $scope.images.length;
                    if ($scope.curIndex < count - 1) {
                        $scope.curIndex += 1;
                    }
                };
            }]
        };
    });

};
