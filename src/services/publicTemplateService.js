var unique = require('../../libs/array').unique;

module.exports = function (app) {

    app.service('publicTemplateService', [
        'dmbdRest',
        'resourcePathService',
        'editorResourceService',
        function (dmbdRest,
                  resourcePathService,
                  editorResourceService) {

            //获取模板列表
            this.getTemplateList = function (data, success) {
                //var apiUrl = '/TBXEditor/mock/template_list2.json';
                var apiUrl = '/api/templatePublic/getTemplatePublicListPage';
                return dmbdRest.get(apiUrl, {
                    pageSize: data.pageSize,
                    pageIndex: data.pageIndex
                }, function (content) {
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
                            creator: item.creator
                        };
                        templates.push(template);

                        var paths = editorResourceService.getResourcePathsFromPages([template.page]);//提炼出资源标识符
                        paths.forEach(function (path) {
                            allPaths.push(path);
                        });
                    });

                    allPaths = unique(allPaths);//去重复

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
            };

            //根据ID获取模板
            this.getTemplateById = function (tid, success) {
                var apiUrl = '/api/templatePublic/getTemplatePublicById';
                return dmbdRest.get(apiUrl, {
                    id: tid
                }, function (content) {
                    var template = {
                        id: content.id,
                        name: content.name,
                        pixelHorizontal: content.pixelHorizontal,
                        pixelVertical: content.pixelVertical,
                        page: angular.fromJson(content.content),
                        createTime: content.createTime,
                        creator: content.creator
                    };

                    var paths = editorResourceService.getResourcePathsFromPages([template.page]);//提炼出资源标识符

                    if (paths.length === 0) {
                        success(template);
                    } else {
                        resourcePathService.getMaterialMapByPaths(paths, function (pathMaps) {
                            editorResourceService.setResourcePropertyWithoutPathToPages([template.page], pathMaps);

                            success(template);
                        });
                    }
                });
            };

            //新增模板
            this.addTemplate = function (data, success) {
                data = angular.copy(data);//深度克隆对象，防止原始数据被更改
                var apiUrl = '/api/templatePublic/saveTemplatePublic';
                editorResourceService.deleteResourcePropertyWithoutPathFromPages([data.page]);
                return dmbdRest.post(apiUrl, {
                    name: data.name,
                    pixelHorizontal: data.pixelHorizontal,
                    pixelVertical: data.pixelVertical,
                    content: angular.toJson(data.page)
                }, function (content) {
                    success(content);
                });
            };

            //更新模板
            this.updateTemplateById = function (tid, data, success) {
                data = angular.copy(data);//深度克隆对象，防止原始数据被更改
                var apiUrl = '/api/templatePublic/saveTemplatePublic';
                editorResourceService.deleteResourcePropertyWithoutPathFromPages([data.page]);
                return dmbdRest.post(apiUrl, {
                    id: tid,
                    name: data.name,
                    pixelHorizontal: data.pixelHorizontal,
                    pixelVertical: data.pixelVertical,
                    content: angular.toJson(data.page)
                }, function (content) {
                    success(content);
                });
            };

            //删除模板
            this.deleteTemplateById = function (tid, success) {
                var apiUrl = '/api/templatePublic/deleteTemplatePublic';
                return dmbdRest.post(apiUrl, {
                    id: tid
                }, function (content) {
                    success(content);
                });
            };

            //增加模板热度
            this.increaseTemplateHotById = function (tid, success) {
                var apiUrl = '/api/templatePublic/updateTemplatePublicHotById';
                return dmbdRest.post(apiUrl, {
                    id: tid
                }, function (content) {
                    success(content);
                });
            };

        }]);

};