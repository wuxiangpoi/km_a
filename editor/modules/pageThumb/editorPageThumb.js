var tplHtml = require('./editorPageThumb.html');

var less = require('./editorPageThumb.less');


module.exports = function (app) {

    require('./components/index')(app);

    //页面缩略图
    app.directive('editorPageThumb', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                size: '=',
                programSize: '=',
                page: '='
            },
            controller: ['$scope', function ($scope) {

                var watcher = $scope.$watchGroup(['pixelHorizontal', 'pixelVertical'], function (args) {
                    var pixelHorizontal = args[0];
                    var pixelVertical = args[1];
                    var maxSize = pixelHorizontal > pixelVertical ? pixelHorizontal : pixelVertical;
                    $scope.scale = $scope.programSize / maxSize;
                });
                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
                
            }]
        };
    });

};
