var tplHtml = require('./editorElementPropertyWebview.html');

module.exports = function (app) {

    app.directive('editorElementPropertyWebview', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {

                //当URL变化时
                $scope.urlChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.url = newVal;
                    }, function () {
                        data.url = oldVal;
                    }, $scope);
                };

                //当自动刷新状态变化时
                $scope.autoRefreshChange = function (autoRefresh) {
                    var data = $scope.data;
                    var oldVal = !autoRefresh;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.autoRefresh = autoRefresh;
                    }, function () {
                        data.autoRefresh = oldVal;
                    }, $scope);
                };

                //当刷新间隔时间变化时
                $scope.refreshIntervalChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.refreshInterval = newVal;
                    }, function () {
                        data.refreshInterval = oldVal;
                    }, $scope);
                };
            }]
        };
    });

};
