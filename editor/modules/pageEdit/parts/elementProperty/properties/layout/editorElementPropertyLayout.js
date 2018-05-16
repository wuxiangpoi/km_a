var tplHtml = require('./editorElementPropertyLayout.html');

module.exports = function (app) {

    app.directive('editorElementPropertyLayout', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                layout: '=',
                pixelHorizontal: '=',
                pixelVertical: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {

                //$scope.pixelWidthBlur = function (pixelWidth, $event) {
                //    if (pixelWidth < 0 || pixelWidth > $scope.pixelHorizontal - $scope.rect.pixelLeft) {
                //        window.alert('取值范围有误!');
                //    }
                //};

                $scope.rect = {
                    pixelWidth: 0,
                    pixelHeight: 0,
                    pixelLeft: 0,
                    pixelTop: 0
                };

                var watcher = $scope.$watchGroup(['pixelHorizontal', 'pixelVertical'], function (args) {
                    var pixelHorizontal = args[0];
                    var pixelVertical = args[1];
                    var layout = $scope.layout;
                    var rect = $scope.rect;
                    rect.pixelWidth = Math.round(pixelHorizontal * layout.width / 100);
                    rect.pixelHeight = Math.round(pixelVertical * layout.height / 100);
                    rect.pixelLeft = Math.round(pixelHorizontal * layout.left / 100);
                    rect.pixelTop = Math.round(pixelVertical * layout.top / 100);
                });

                var watcher2 = $scope.$watch('layout', function (layout) {
                    var pixelHorizontal = $scope.pixelHorizontal;
                    var pixelVertical = $scope.pixelVertical;
                    var rect = $scope.rect;
                    rect.pixelWidth = Math.round(pixelHorizontal * layout.width / 100);
                    rect.pixelHeight = Math.round(pixelVertical * layout.height / 100);
                    rect.pixelLeft = Math.round(pixelHorizontal * layout.left / 100);
                    rect.pixelTop = Math.round(pixelVertical * layout.top / 100);
                }, true);

                var watcher3 = $scope.$watch('rect', function (rect) {
                    var pixelHorizontal = $scope.pixelHorizontal;
                    var pixelVertical = $scope.pixelVertical;
                    var layout = $scope.layout;
                    layout.width = rect.pixelWidth * 100 / pixelHorizontal;
                    layout.height = rect.pixelHeight * 100 / pixelVertical;
                    layout.left = rect.pixelLeft * 100 / pixelHorizontal;
                    layout.top = rect.pixelTop * 100 / pixelVertical;
                }, true);

                //var watcher4 = $scope.$watch('rect.pixelWidth', function (pixelWidth) {
                //    var pixelHorizontal = $scope.pixelHorizontal;
                //    var rect = $scope.rect;
                //    if (pixelWidth < 0) {
                //        rect.pixelWidth = 0;
                //    } else if (pixelWidth > pixelHorizontal - rect.pixelLeft) {
                //        rect.pixelWidth = pixelHorizontal - rect.pixelLeft;
                //    }
                //});

                //销毁时移除事件
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                    watcher2();
                    watcher3();
                    //watcher4();
                });

                $scope.onHorizontalAlign = function (oldVal, newVal) {
                    var layout = $scope.layout;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        layout.left = newVal;
                    }, function () {
                        layout.left = oldVal;
                    }, $scope);
                };

                $scope.onVerticalAlign = function (oldVal, newVal) {
                    var layout = $scope.layout;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        layout.top = newVal;
                    }, function () {
                        layout.top = oldVal;
                    }, $scope);
                };

                //置顶
                $scope.setFront = function () {
                    $scope.$emit('editor-set-front');
                };

                //置底
                $scope.setBack = function () {
                    $scope.$emit('editor-set-back');
                };

                //当旋转时
                $scope.rotateChange = function (newVal, oldVal) {
                    var layout = $scope.layout;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        layout.rotate = newVal;
                    }, function () {
                        layout.rotate = oldVal;
                    }, $scope);
                };
            }]
        };
    });

};
