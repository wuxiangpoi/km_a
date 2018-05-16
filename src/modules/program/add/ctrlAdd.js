module.exports = [
    '$scope',
    '$state',
    'dialogService',
    'programService',
    'templateService',
    'editorTestService',
    function ($scope,
              $state,
              dialogService,
              programService,
              templateService,
              editorTestService) {

        $scope.program = {
            pixelHorizontal: 1920,
            pixelVertical: 1080,
            pages: []
        };

        //可选的空白模板比例
        var emptyRates = [
            {"pixelHorizontal": 1920, "pixelVertical": 1080},
            {"pixelHorizontal": 1080, "pixelVertical": 1920},
            {"pixelHorizontal": 1366, "pixelVertical": 768},
            {"pixelHorizontal": 768, "pixelVertical": 1366}
        ];

        //进入新增节目界面时，自动弹窗选择模板
        dialogService.openSingleTemplateSelectDialog(emptyRates, function (template) {
            $scope.program.pixelHorizontal = template.pixelHorizontal;
            $scope.program.pixelVertical = template.pixelVertical;
            $scope.program.pages.push(template.page);

            $scope.$broadcast('auto-selected-template', template);
        });

        //选取单个模板
        $scope.$on('on-select-single-page', function (e, callback) {
            var emptyRates = [{
                pixelHorizontal: $scope.program.pixelHorizontal,
                pixelVertical: $scope.program.pixelVertical
            }];
            dialogService.openSingleTemplateSelectDialog(emptyRates, callback);
        });

        $scope.selectPixel = dialogService.openPixelSelectorDialog;

        //选取单个图片
        $scope.$on('on-select-single-image', function (e, image, callback) {
            dialogService.openSingleImageSelectDialog(image, callback);
        });

        //选取多个图片
        $scope.$on('on-select-multiple-image', function (e, images, callback) {
            dialogService.openMultipleImageSelectDialog(images, callback);
        });

        //选取单个音频
        $scope.$on('on-select-single-audio', function (e, audio, callback) {
            dialogService.openSingleAudioSelectDialog(audio, callback);
        });

        //选取单个视频
        $scope.$on('on-select-single-video', function (e, video, callback) {
            dialogService.openSingleVideoSelectDialog(video, callback);
        });

        //选取多个视频
        $scope.$on('on-select-multiple-video', function (e, videos, callback) {
            dialogService.openMultipleVideoSelectDialog(videos, callback);
        });

        //预览
        $scope.goPreview = dialogService.openProgramPreviewDialog;

        //返回
        $scope.goBack = function () {
            //window.history.back();
            $state.go("dashboard.program");
        };

        //提交保存节目
        $scope.submitAddProgram = function (pixelHorizontal, pixelVertical, pages) {
            if (pages.length === 0) {
                layer.alert('不能保存空节目！');
                return;
            }

            var sensitiveWord = editorTestService.getFirstSensitiveWord(pages);
            if (sensitiveWord !== null) {//存在敏感词
                layer.alert('抱歉，你的文字中包含有被禁止的词汇（' + sensitiveWord + '），建议你修改相关内容');
                return;
            }

            if (editorTestService.testAnyElementIsEmpty(pages)) {//有任何一个元素内容为空
                layer.confirm('当前节目存在无内容控件，是否继续保存？', {
                    btn: ['保存', '取消']
                }, function () {
                    layer.closeAll('dialog');
                    saveData();
                });
            } else {
                saveData();
            }

            function saveData() {
                dialogService.openProgramSaveDialog({
                    pixelHorizontal: pixelHorizontal,
                    pixelVertical: pixelVertical,
                    name: '',
                    pages: pages,
                    oid: null//组织机构ID
                }, function (name, oid, callback) {
                    programService.addProgram({
                        oid: oid,
                        name: name,
                        pixelHorizontal: pixelHorizontal,
                        pixelVertical: pixelVertical,
                        pages: pages
                    }, function (data) {
                        isSureToLeave = true;
                        callback();
                        programService.savePixel(pixelHorizontal, pixelVertical);
                        $scope.goBack();
                    });
                });
            }
        };

        //保存模板
        $scope.saveTemplate = function (pixelHorizontal, pixelVertical, page) {

            if (page === null) {
                layer.alert('当前未选中场景！');
                return;
            }

            if (page.elements.length === 0) {
                layer.alert('不能保存空白模板！');
                return;
            }

            var sensitiveWord = editorTestService.getFirstSensitiveWord([page]);
            if (sensitiveWord !== null) {//存在敏感词
                layer.alert('抱歉，你的文字中包含有被禁止的词汇（' + sensitiveWord + '），建议你修改相关内容');
                return;
            }

            dialogService.openTemplateSaveDialog({
                pixelHorizontal: pixelHorizontal,
                pixelVertical: pixelVertical,
                page: page
            }, function (name, callback) {
                templateService.addTemplate({
                    name: name,
                    pixelHorizontal: pixelHorizontal,
                    pixelVertical: pixelVertical,
                    page: page
                }, function (data) {
                    callback();
                    layer.msg('已保存模板！');
                    //console.log('已保存模板！');
                });
            });
        };

        var isSureToLeave = false;

        bindStateChange();

        //内容有修改后跳走才会有提示
        function bindStateChange() {
            var oriData = angular.toJson($scope.program);

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (!isSureToLeave) {
                    var nowData = angular.toJson($scope.program);
                    if (nowData !== oriData) {
                        event.preventDefault();
                        layer.confirm('有修改尚未保存，确定要离开吗？', {
                            btn: ['是', '否']
                        }, function () {
                            layer.closeAll('dialog');
                            isSureToLeave = true;
                            $state.go(toState, toParams);
                            console.log('true');
                        });
                    }
                }
            });
        }

    }];