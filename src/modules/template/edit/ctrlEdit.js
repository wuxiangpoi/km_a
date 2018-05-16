module.exports = [
    '$scope',
    '$state',
    '$stateParams',
    'dialogService',
    'publicTemplateService',
    'editorTestService',
    function ($scope,
              $state,
              $stateParams,
              dialogService,
              templateService,
              editorTestService) {

        var tid = $stateParams.id;//模板ID

        templateService.getTemplateById(tid, function (template) {
            $scope.template = template;

            bindStateChange();
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
            $state.go("dashboard.templateList");
        };

        //保存模板
        $scope.saveTemplate = function (pixelHorizontal, pixelVertical, page) {
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
                name: $scope.template.name,
                pixelHorizontal: pixelHorizontal,
                pixelVertical: pixelVertical,
                page: page
            }, function (name, callback) {
                templateService.updateTemplateById(tid, {
                    name: name,
                    pixelHorizontal: pixelHorizontal,
                    pixelVertical: pixelVertical,
                    page: page
                }, function (data) {
                    isSureToLeave = true;
                    callback();
                    layer.msg('已保存模板！');
                    //console.log('已保存模板！');
                    $scope.goBack();
                });
            });
        };

        var isSureToLeave = false;

        //内容有修改后跳走才会有提示
        function bindStateChange() {
            var oriData = angular.toJson($scope.template);

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (!isSureToLeave) {
                    var nowData = angular.toJson($scope.template);
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