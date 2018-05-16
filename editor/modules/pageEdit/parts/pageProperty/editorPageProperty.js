var tplHtml = require('./editorPageProperty.html');

var less = require('./editorPageProperty.less');

module.exports = function (app) {

    require('./properties/index.less');
    require('./properties/index')(app);

    //元素属性编辑模块
    app.directive('editorPageProperty', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                page: '='
            },
            controller: ['$scope', 'editorTabRecordService', function ($scope, editorTabRecordService) {

                $scope.tabIndex = editorTabRecordService.getPageTabIndex();
                $scope.setTabIndex = function (tabIndex) {
                    $scope.tabIndex = tabIndex;
                    editorTabRecordService.setPageTabIndex(tabIndex);
                };

            }]
        };
    });

};
