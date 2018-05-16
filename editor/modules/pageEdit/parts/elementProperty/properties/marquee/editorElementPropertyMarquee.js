var tplHtml = require('./editorElementPropertyMarquee.html');

module.exports = function (app) {

    app.directive('editorElementPropertyMarquee', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {

                //文字部分变化
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

                //当速度变化时
                $scope.speedChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.speed = newVal;
                    }, function () {
                        data.speed = oldVal;
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

                //当方向变化时
                $scope.isLeftChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.isLeft = newVal;
                    }, function () {
                        data.isLeft = oldVal;
                    }, $scope);
                };
            }]
        };
    });

};
