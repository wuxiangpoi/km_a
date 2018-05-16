var tplHtml = require('./editorElementPropertyTime.html');

module.exports = function (app) {

    app.directive('editorElementPropertyTime', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '=',
                backGround: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {
                //当日期格式变化时
                $scope.formatterChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.formatter = newVal;
                    }, function () {
                        data.formatter = oldVal;
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

                //当背景颜色变化时
                $scope.backGroundColorChange = function (newVal, oldVal) {
                    var data = $scope.backGround;
                    var oldType = data.type;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.color.r = newVal.r;
                        data.color.g = newVal.g;
                        data.color.b = newVal.b;
                        data['type'] = 1;
                    }, function () {
                        data.color.r = oldVal.r;
                        data.color.g = oldVal.g;
                        data.color.b = oldVal.b;
                        data['type'] = oldType;
                    }, $scope);
                };

                //当背景类型变化时
                $scope.backGroundTypeChange = function (newVal, oldVal) {
                    var data = $scope.backGround;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data['type'] = newVal;
                    }, function () {
                        data['type'] = oldVal;
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
