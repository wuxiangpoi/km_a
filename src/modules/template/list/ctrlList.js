var remove = require('../../../../libs/array').remove;
import { tempResolution } from '../../../filter/options'

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
        $scope.tempResolution = tempResolution;
        let publicStatusOptions = [{
            val: '',
            name: '发布状态'
        },
        {
            val: 1,
            name: '已发布'
        },
        {
            val: 0,
            name: '未发布'
        }]
        $scope.publicStatusOptions = publicStatusOptions;
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
        function getTemplateList(params, success) {
            let apiUrl = '/api/templatePublic/getTemplatePublicListPage';
                baseService.postData(baseService.api.apiUrl + apiUrl, params, function (content) {
                    var templates = [];

                    var allPaths = [];
                    content.data.forEach(function (item) {
                        var template = {
                            id: item.id,
                            name: item.name,
                            pixelHorizontal: item.pixelHorizontal,
                            pixelVertical: item.pixelVertical,
                            page: angular.fromJson(item.content),
                            createTime: item.createTime,
                            creator: item.creator,
                            hot: item.hot,
                            status: item.status
                        };
                        templates.push(template);

                        var paths = editorResourceService.getResourcePathsFromPages([template.page]);//提炼出资源标识符
                        paths.forEach(function (path) {
                            allPaths.push(path);
                        });
                    });
                    //allPaths = unique(allPaths);//去重复

                    if (allPaths.length === 0) {

                        success(templates, content.recordsTotal);
                    } else {
                        resourcePathService.getMaterialMapByPaths(allPaths, function (pathMaps) {
                            templates.forEach(function (template) {
                                editorResourceService.setResourcePropertyWithoutPathToPages([template.page], pathMaps);

                                template.pixelHorizontal = template.pixelHorizontal || 1920;
                                template.pixelVertical = template.pixelVertical || 1080;
                            });
                            success(templates, content.recordsTotal);
                        });
                    }

                });
        }
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
            let params = $scope.sp;
            getTemplateList(params, function (data, recordCount) {

                $scope.displayed = data;
                num = num || $rootScope.paginationNumber[0];
                tableState.pagination.number = num;
                tableState.pagination.totalItemCount = recordCount;
                tableState.pagination.numberOfPages = Math.ceil(recordCount / num);
                $scope.isLoading = false;
                
            });
        }
        $scope.initPage = () => {
            $scope.callServer($scope.tableState,0);
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
            baseService.confirm('删除模板', "确定删除模板：" + item.name + "?", function (vm) {
                vm.isPosting = true;
                baseService.postData(baseService.api.apiUrl + '/api/templatePublic/deleteTemplatePublic', {
                    id: item.id
                }, function (item) {
                    vm.isPosting = false;
                    vm.closeThisDialog();
                    baseService.alert("删除成功", 'success');
                    $scope.callServer($scope.tableState,0);
                });
            });
        };
        $scope.public = function (item) {
            baseService.confirm('发布模板', "确定发布模板：" + item.name + "?",function (vm) {
                vm.isPosting = true;
                baseService.postData(baseService.api.apiUrl + '/api/templatePublic/releaseTemplatePublic', {
                    id: item.id
                }, function (item) {
                    vm.isPosting = false;
                    vm.closeThisDialog();
                    baseService.alert("发布成功", 'success');
                    $scope.callServer($scope.tableState);
                });
            });
        };
    }
];