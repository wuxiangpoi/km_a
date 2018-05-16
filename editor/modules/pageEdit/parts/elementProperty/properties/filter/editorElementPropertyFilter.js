var tplHtml = require('./editorElementPropertyFilter.html');

module.exports = function (app) {

    app.directive('editorElementPropertyFilter', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                filter: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {
                //当不透明度变化时
                $scope.opacityChange = function (newVal, oldVal) {
                    var filter = $scope.filter;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        filter.opacity = newVal;
                    }, function () {
                        filter.opacity = oldVal;
                    }, $scope);
                };

                //当亮度变化时
                $scope.brightnessChange = function (newVal, oldVal) {
                    var filter = $scope.filter;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        filter.brightness = newVal;
                    }, function () {
                        filter.brightness = oldVal;
                    }, $scope);
                };

                //当对比度变化时
                $scope.contrastChange = function (newVal, oldVal) {
                    var filter = $scope.filter;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        filter.contrast = newVal;
                    }, function () {
                        filter.contrast = oldVal;
                    }, $scope);
                };

                //当饱和度变化时
                $scope.saturateChange = function (newVal, oldVal) {
                    var filter = $scope.filter;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        filter.saturate = newVal;
                    }, function () {
                        filter.saturate = oldVal;
                    }, $scope);
                };

                //当灰度变化时
                $scope.grayscaleChange = function (newVal, oldVal) {
                    var filter = $scope.filter;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        filter.grayscale = newVal;
                    }, function () {
                        filter.grayscale = oldVal;
                    }, $scope);
                };

                //当反色变化时
                $scope.invertChange = function (newVal, oldVal) {
                    var filter = $scope.filter;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        filter.invert = newVal;
                    }, function () {
                        filter.invert = oldVal;
                    }, $scope);
                };

                //当模糊度变化时
                $scope.blurChange = function (newVal, oldVal) {
                    var filter = $scope.filter;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        filter.blur = newVal;
                    }, function () {
                        filter.blur = oldVal;
                    }, $scope);
                };

                //当色相变化时
                $scope.hueRotateChange = function (newVal, oldVal) {
                    var filter = $scope.filter;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        filter.hueRotate = newVal;
                    }, function () {
                        filter.hueRotate = oldVal;
                    }, $scope);
                };
            }]
        };
    });

};
