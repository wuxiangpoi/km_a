var remove = require('../../../../libs/array').remove;

module.exports = [
    '$scope',
    'publicTemplateService',
    'dialogService',
    'baseService',
    'editorResourceService',
    'resourcePathService',
    'resourcePathService',
    function ($scope,
        templateService,
        dialogService,
        baseService,
        editorResourceService,
        resourcePathService) {
        $scope.sp = {};
        //根据ID预览节目
        //$scope.programPreviewById = dialogService.openProgramPreviewDialogById;

        // $scope.pageSize = 10;
        // $scope.pageIndex = 0;
        // $scope.recordCount = 0;
        // $scope.doPaging = doPaging;

        //doPaging(0);//默认打开第一页

        //执行翻页动作
        // function doPaging(pageIndex) {
        //     var data = {
        //         pageSize: $scope.pageSize,
        //         pageIndex: pageIndex
        //     };
        //     templateService.getTemplateList(data, function (data, recordCount) {
        //         $scope.recordCount = recordCount;
        //         $scope.pageIndex = pageIndex;
        //         $scope.templates = data;
        //     });
        // }
        $scope.callServer = function (tableState,page) {
            $scope.isLoading = true;
            if (baseService.isRealNum(page)) {
                $scope.tableState.pagination.start = page * $scope.sp.length;
            }
            $scope.tableState = tableState;
            var pagination = tableState.pagination;

            var start = pagination.start || 0;
            var num = $scope.sp.length;
            $scope.sp.start = start;
            templateService.getTemplateList({}, function (data, recordCount) {
                $scope.displayed = data;
                num = num || $rootScope.paginationNumber[0];
                tableState.pagination.number = num;
                tableState.pagination.totalItemCount = recordCount;
                tableState.pagination.numberOfPages = Math.ceil(recordCount / num);
                $scope.isLoading = false;
                
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
        // $scope.deleteTemplate = function (template) {
        //     layer.confirm('确定删除该模板吗？', {
        //         btn: ['确定', '取消']
        //     }, function () {
        //         templateService.deleteTemplateById(template.id, function (result) {
        //             remove($scope.templates, template);
        //             layer.msg('已删除该模板！');
        //         });
        //     });
        // };
        $scope.deleteTemplate = function (item) {
            baseService.confirm('删除模版', "确定删除模版：" + item.name + "?", function (vm) {
                baseService.postData(baseService.api.apiUrl + '/api/templatePublic/deleteTemplatePublic', {
                    id: item.id
                }, function (item) {
                    vm.closeThisDialog();
                    baseService.alert("删除成功", 'success');
                    $scope.callServer($scope.tableState,0);
                });
            });
        };

    }
];