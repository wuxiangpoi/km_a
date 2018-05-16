var tplHtml = require('./editorElementPropertyBorder.html');

module.exports = function (app) {

    app.directive('editorElementPropertyBorder', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                border: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {
                //当样式变化时
                $scope.styleChange = function (newVal, oldVal) {
                    var border = $scope.border;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        border.style = newVal;
                    }, function () {
                        border.style = oldVal;
                    }, $scope);
                };

                //当颜色变化时
                $scope.colorChange = function (newVal, oldVal) {
                    var border = $scope.border;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        border.color.r = newVal.r;
                        border.color.g = newVal.g;
                        border.color.b = newVal.b;
                    }, function () {
                        border.color.r = oldVal.r;
                        border.color.g = oldVal.g;
                        border.color.b = oldVal.b;
                    }, $scope);
                };

                //当宽度变化时
                $scope.widthChange = function (newVal, oldVal) {
                    var border = $scope.border;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        border.width = newVal;
                    }, function () {
                        border.width = oldVal;
                    }, $scope);
                };

                //当内边距变化时
                $scope.paddingChange = function (newVal, oldVal) {
                    var border = $scope.border;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        border.padding = newVal;
                    }, function () {
                        border.padding = oldVal;
                    }, $scope);
                };

                //当圆角变化时
                $scope.radiusChange = function (newVal, oldVal) {
                    var border = $scope.border;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        border.radius = newVal;
                    }, function () {
                        border.radius = oldVal;
                    }, $scope);
                };

                //当不透明度变化时
                $scope.opacityChange = function (newVal, oldVal) {
                    var border = $scope.border;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        border.opacity = newVal;
                    }, function () {
                        border.opacity = oldVal;
                    }, $scope);
                };
            }]
        };
    });

};
