var tplHtml = require('./editorElementPropertyBackground.html');

module.exports = function (app) {

    app.directive('editorElementPropertyBackground', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                backGround: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {

                //背景类型变化时
                $scope.typeChange = function (newVal, oldVal) {
                    var data = $scope.backGround;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.type = newVal;
                    }, function () {
                        data.type = oldVal;
                    }, $scope);
                };

                //当图片变化时
                $scope.imageChange = function (newVal, oldVal) {
                    var data = $scope.backGround;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.image = newVal;
                    }, function () {
                        data.image = oldVal;
                    }, $scope);
                };

                //当颜色变化时
                $scope.colorChange = function (newVal, oldVal) {
                    var data = $scope.backGround;

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
            }]
        };
    });

};
