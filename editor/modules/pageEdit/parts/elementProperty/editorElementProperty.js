var tplHtml = require('./editorElementProperty.html');

var less = require('./editorElementProperty.less');

module.exports = function (app) {

    require('./properties/index.less');
    require('./properties/index')(app);

    //元素属性编辑模块
    app.directive('editorElementProperty', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                ele: '='
            },
            controller: ['$scope', 'editorTabRecordService', function ($scope, editorTabRecordService) {

                $scope.tabIndex = editorTabRecordService.getElementTabIndex();
                $scope.setTabIndex = function (tabIndex) {
                    $scope.tabIndex = tabIndex;
                    editorTabRecordService.setElementTabIndex(tabIndex);
                };

            }]
        };
    });

};
