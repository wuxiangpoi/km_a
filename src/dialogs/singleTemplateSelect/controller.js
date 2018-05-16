var remove = require('../../../libs/array').remove;

var storageKey = 'editor-template-select-default-tabIndex';

function getDefaultTabIndex() {
    try {
        var defaultIndex = 1;
        var text = window.localStorage.getItem(storageKey);
        if (text) {
            var tabIndex = window.parseInt(text, 10);
            if (isNaN(tabIndex) || tabIndex < 0 || tabIndex > 2) {//不是数字或者超出范围
                return defaultIndex;
            } else {
                return tabIndex;
            }
        } else {
            return defaultIndex;
        }
    } catch (e) {
        console.error('localStorage.getItem', e);
        return defaultIndex;
    }
}

function setDefaultTabIndex(tabIndex) {
    try {
        window.localStorage.setItem(storageKey, tabIndex);
    } catch (e) {
        console.error('localStorage.setItem', e);
    }
}

var defaultTemplates = require('../../default/defaultTemplates');

module.exports = function (emptyRates, callback) {
    return ['$scope', 'templateService', 'publicTemplateService', function ($scope, templateService, publicTemplateService) {
        $scope.tabIndex = getDefaultTabIndex();
        $scope.selectTab = function (index) {
            $scope.tabIndex = index;
            setDefaultTabIndex(index);
        };

        //空白模板
        (function () {
            var templates = [];

            emptyRates.forEach(function (rate) {
                templates.push({
                    "name": "空白模板",
                    "pixelHorizontal": rate.pixelHorizontal,
                    "pixelVertical": rate.pixelVertical,
                    "page": {
                        "ver": 1,
                        "stay": 60,
                        "background": {
                            "ver": 1,
                            "type": 0,
                            "image": null,
                            "color": {
                                "r": 0,
                                "g": 0,
                                "b": 0
                            },
                            "opacity": 100
                        },
                        "elements": []
                    }
                });
            });

            defaultTemplates.forEach(function (item) {
                templates.push(item);
            });

            $scope.pageSize0 = 10;
            $scope.pageIndex0 = 0;
            $scope.recordCount0 = 0;
            $scope.doPaging0 = doPaging;

            doPaging(0);//默认打开第一页

            //执行翻页动作
            function doPaging(pageIndex) {

                $scope.recordCount0 = templates.length;
                $scope.pageIndex0 = pageIndex;
                $scope.emptyTemplates = templates.slice(
                    $scope.pageSize0 * pageIndex,
                    $scope.pageSize0 * (pageIndex + 1));

            }

        })();

        //公用模板翻页部分
        (function () {
            $scope.pageSize1 = 10;
            $scope.pageIndex1 = 0;
            $scope.recordCount1 = 0;
            $scope.doPaging1 = doPaging;

            doPaging(0);//默认打开第一页

            //执行翻页动作
            function doPaging(pageIndex) {
                var data = {
                    pageSize: $scope.pageSize1,
                    pageIndex: pageIndex
                };
                //获取数据
                publicTemplateService.getTemplateList(data, function (data, recordCount) {
                    $scope.recordCount1 = recordCount;
                    $scope.pageIndex1 = pageIndex;
                    $scope.common_templates = data;
                });
            }
        })();

        //私有模板翻页部分
        (function () {
            $scope.pageSize2 = 10;
            $scope.pageIndex2 = 0;
            $scope.recordCount2 = 0;
            $scope.doPaging2 = doPaging;

            doPaging(0);//默认打开第一页

            //执行翻页动作
            function doPaging(pageIndex) {
                var data = {
                    pageSize: $scope.pageSize2,
                    pageIndex: pageIndex
                };
                //获取数据
                templateService.getTemplateList(data, function (data, recordCount) {
                    $scope.recordCount2 = recordCount;
                    $scope.pageIndex2 = pageIndex;
                    $scope.templates = data;
                });
            }
        })();

        //选取共有模板
        $scope.choosePublicTemplate = function (template) {
            template = angular.copy(template);
            callback(template);
            $scope.closeThisDialog();
            //添加热度统计
            publicTemplateService.increaseTemplateHotById(template.id, function (content) {
                console.log(content);
            });
        };

        //选取模板
        $scope.chooseTemplate = function (template) {
            template = angular.copy(template);
            callback(template);
            $scope.closeThisDialog();
        };

        //删除模板
        $scope.deleteTemplate = function (template, $event) {
            $event.stopPropagation();

            layer.confirm('确定删除该模板吗？', {
                btn: ['确定', '取消']
            }, function () {
                templateService.deleteTemplateById(template.id, function () {
                    remove($scope.templates, template);
                    layer.msg('已删除该模板！');
                });
            });

        };

        //关闭弹窗
        $scope.close_dialog = function () {
            $scope.closeThisDialog(); //关闭弹窗
        };
    }];
};