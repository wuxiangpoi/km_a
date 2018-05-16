var remove = require('../../../../libs/array').remove;

module.exports = [
    '$scope',
    'publicTemplateService',
    'dialogService',
    function ($scope,
              templateService,
              dialogService) {

        //根据ID预览节目
        //$scope.programPreviewById = dialogService.openProgramPreviewDialogById;

        $scope.pageSize = 10;
        $scope.pageIndex = 0;
        $scope.recordCount = 0;
        $scope.doPaging = doPaging;

        doPaging(0);//默认打开第一页

        //执行翻页动作
        function doPaging(pageIndex) {
            var data = {
                pageSize: $scope.pageSize,
                pageIndex: pageIndex
            };
            templateService.getTemplateList(data, function (data, recordCount) {
                $scope.recordCount = recordCount;
                $scope.pageIndex = pageIndex;
                $scope.templates = data;
            });
        }

        //模板预览
        $scope.templatePreview = function (template) {
            dialogService.openTemplatePreviewDialog(
                template.pixelHorizontal,
                template.pixelVertical,
                template.page
            );
        };

        //删除节目
        $scope.deleteTemplate = function (template) {
            layer.confirm('确定删除该模板吗？', {
                btn: ['确定', '取消']
            }, function () {
                templateService.deleteTemplateById(template.id, function (result) {
                    remove($scope.templates, template);
                    layer.msg('已删除该模板！');
                });
            });
        };

    }];