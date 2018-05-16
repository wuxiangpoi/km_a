var tplHtml = require('./editorElementPropertyText.html');

module.exports = function (app) {

    app.directive('editorElementPropertyText', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {
                //单行/多行模式变化
                $scope.isMultipleChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.isMultiple = newVal;
                    }, function () {
                        data.isMultiple = oldVal;
                    }, $scope);
                };

                //当文字内容变化
                $scope.valueChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.value = newVal;
                    }, function () {
                        data.value = oldVal;
                    }, $scope);
                };

                //当字体变化时
                $scope.fontChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.font = newVal;
                    }, function () {
                        data.font = oldVal;
                    }, $scope);
                };

                //当颜色变化时
                $scope.colorChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.color.r = newVal.r;
                        data.color.g = newVal.g;
                        data.color.b = newVal.b;
                    }, function () {
                        data.color.r = oldVal.r;
                        data.color.g = oldVal.g;
                        data.color.b = oldVal.b;
                    }, $scope);
                };

                //当大小变化时
                $scope.sizeChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.size = newVal;
                    }, function () {
                        data.size = oldVal;
                    }, $scope);
                };

                //当水平对齐变化时
                $scope.horizontalAlignChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.horizontalAlign = newVal;
                    }, function () {
                        data.horizontalAlign = oldVal;
                    }, $scope);
                };

                //当垂直对齐变化时
                $scope.verticalAlignChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.verticalAlign = newVal;
                    }, function () {
                        data.verticalAlign = oldVal;
                    }, $scope);
                };
            }]
        };
    });

};
