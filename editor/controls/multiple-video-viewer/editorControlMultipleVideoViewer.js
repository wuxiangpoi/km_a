var tplHtml = require('./editorControlMultipleVideoViewer.html');

module.exports = function (app) {

    app.directive('editorControlMultipleVideoViewer', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                videos: '='
            },
            controller: ['$scope', function ($scope) {
                var watcher = $scope.$watchCollection('videos', function (videos) {
                    $scope.curIndex = -1;
                    if (videos.length !== 0) {
                        $scope.curIndex = 0;
                    }
                });

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

                $scope.prevVideo = function () {
                    if ($scope.curIndex > 0) {
                        $scope.curIndex -= 1;
                    }
                };

                $scope.nextVideo = function () {
                    var count = $scope.videos.length;
                    if ($scope.curIndex < count - 1) {
                        $scope.curIndex += 1;
                    }
                };
            }]
        };
    });

};
