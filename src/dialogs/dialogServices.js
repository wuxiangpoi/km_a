var tplTemplateSave = require('./templateSave/templateSave.html');
var ctrlTemplateSave = require('./templateSave/controller');
var tplPixelSelector = require('./pixelSelector/pixelSelector.html');
var ctrlPixelSelector = require('./pixelSelector/controller');
var tplProgramSave = require('./programSave/programSave.html');
var ctrlProgramSave = require('./programSave/controller');
var tplProgramPreview = require('./programPreview/programPreview.html');
var tplTemplatePreview = require('./templatePreview/templatePreview.html');

var tplSingleImageSelect = require('./singleImageSelect/singleImageSelect.html');
var ctrlSingleImageSelect = require('./singleImageSelect/controller');
var tplSingleVideoSelect = require('./singleVideoSelect/singleVideoSelect.html');
var ctrlSingleVideoSelect = require('./singleVideoSelect/controller');
var tplSingleAudioSelect = require('./singleAudioSelect/singleAudioSelect.html');
var ctrlSingleAudioSelect = require('./singleAudioSelect/controller');
var tplMultipleImageSelect = require('./multipleImageSelect/multipleImageSelect.html');
var ctrlMultipleImageSelect = require('./multipleImageSelect/controller');
var tplMultipleVideoSelect = require('./multipleVideoSelect/multipleVideoSelect.html');
var ctrlMultipleVideoSelect = require('./multipleVideoSelect/controller');
var tplSingleTemplateSelect = require('./singleTemplateSelect/singleTemplateSelect.html');
var ctrlSingleTemplateSelect = require('./singleTemplateSelect/controller');

module.exports = function (app) {

    app.service('dialogService', ['ngDialog', 'editorTestService', 'editorResourceService', function (ngDialog, editorTestService, editorResourceService) {

        //列表页面中打开模板预览对话框
        this.openTemplatePreviewDialogById = function (pid) {
            ngDialog.open({
                plain: true,
                template: tplTemplatePreview,
                className: 'ngdialog-theme-default',
                width: '560px',
                controller: ['$scope', 'templateService', function ($scope, templateService) {
                    templateService.getTemplateById(pid, function (template) {
                        $scope.pixelHorizontal = template.pixelHorizontal;
                        $scope.pixelVertical = template.pixelVertical;
                        $scope.pages = [template.page];
                    });

                    //关闭弹窗
                    $scope.close_dialog = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                }]
            });
        };

        //编辑时打开模板预览对话框
        this.openTemplatePreviewDialog = function (pixelHorizontal, pixelVertical, page) {

            var sensitiveWord = editorTestService.getFirstSensitiveWord([page]);
            if (sensitiveWord !== null) {//存在敏感词
                layer.alert('抱歉，你的文字中包含有被禁止的词汇（' + sensitiveWord + '），建议你修改相关内容');
                return;
            }

            //先计算场景停留时间属性
            page.stay = editorResourceService.getPageSuggestTime(page);

            ngDialog.open({
                plain: true,
                template: tplTemplatePreview,
                className: 'ngdialog-theme-default',
                width: '560px',
                controller: ['$scope', function ($scope) {

                    $scope.pixelHorizontal = pixelHorizontal;
                    $scope.pixelVertical = pixelVertical;
                    $scope.pages = [page];

                    //关闭弹窗
                    $scope.close_dialog = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                }]
            });
        };

        //列表页面中打开节目预览对话框
        this.openProgramPreviewDialogById = function (pid) {
            ngDialog.open({
                plain: true,
                template: tplProgramPreview,
                className: 'ngdialog-theme-default',
                width: '560px',
                controller: ['$scope', 'programService', function ($scope, programService) {
                    programService.getProgramById(pid, function (program) {
                        $scope.pixelHorizontal = program.pixelHorizontal;
                        $scope.pixelVertical = program.pixelVertical;
                        $scope.pages = program.pages;
                    });

                    //关闭弹窗
                    $scope.close_dialog = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                }]
            });
        };

        //编辑时打开节目预览对话框
        this.openProgramPreviewDialog = function (pixelHorizontal, pixelVertical, pages) {
            if (pages.length === 0) {
                layer.alert('不能预览空节目！');
                return;
            }

            var sensitiveWord = editorTestService.getFirstSensitiveWord(pages);
            if (sensitiveWord !== null) {//存在敏感词
                layer.alert('抱歉，你的文字中包含有被禁止的词汇（' + sensitiveWord + '），建议你修改相关内容');
                return;
            }

            //先计算场景停留时间属性
            (function () {
                pages.forEach(function (page) {
                    page.stay = editorResourceService.getPageSuggestTime(page);
                });
            })();

            ngDialog.open({
                plain: true,
                template: tplProgramPreview,
                className: 'ngdialog-theme-default',
                width: '560px',
                controller: ['$scope', function ($scope) {

                    $scope.pixelHorizontal = pixelHorizontal;
                    $scope.pixelVertical = pixelVertical;
                    $scope.pages = pages;

                    //关闭弹窗
                    $scope.close_dialog = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                }]
            });
        };

        //打开自定义分辨率选择框
        this.openPixelSelectorDialog = function (ph, pv, callback) {
            ngDialog.open({
                plain: true,
                template: tplPixelSelector,
                className: 'ngdialog-theme-default',
                width: '560px',
                controller: ctrlPixelSelector(ph, pv, callback),
                preCloseCallback: function (value) {
                    //callback(value);
                    return true;
                }
            });
        };

        //打开节目保存对话框
        this.openProgramSaveDialog = function (args, callback) {
            ngDialog.open({
                plain: true,
                template: tplProgramSave,
                className: 'ngdialog-theme-default',
                width: '600px',
                controller: ctrlProgramSave(args, callback)
            });
        };

        //打开模板保存对话框
        this.openTemplateSaveDialog = function (args, callback) {
            ngDialog.open({
                plain: true,
                template: tplTemplateSave,
                className: 'ngdialog-theme-default',
                width: '600px',
                controller: ctrlTemplateSave(args, callback)
            });
        };

        //打开模板选择对话框
        this.openSingleTemplateSelectDialog = function (emptyRates, callback) {

            ngDialog.open({
                plain: true,
                template: tplSingleTemplateSelect,
                className: 'ngdialog-theme-default',
                width: '980px',
                controller: ctrlSingleTemplateSelect(emptyRates, callback)
            });
        };

        //打开图片单选对话框
        this.openSingleImageSelectDialog = function (image, callback) {

            ngDialog.open({
                plain: true,
                template: tplSingleImageSelect,
                className: 'ngdialog-theme-default',
                width: '980px',
                controller: ctrlSingleImageSelect(image, callback)
            });
        };

        //打开图片多选对话框
        this.openMultipleImageSelectDialog = function (images, callback) {

            ngDialog.open({
                plain: true,
                template: tplMultipleImageSelect,
                className: 'ngdialog-theme-default',
                width: '1200px',
                controller: ctrlMultipleImageSelect(images, callback)
            });
        };

        //打开单音频选择对话框
        this.openSingleAudioSelectDialog = function (audio, callback) {

            ngDialog.open({
                plain: true,
                template: tplSingleAudioSelect,
                className: 'ngdialog-theme-default',
                width: '980px',
                controller: ctrlSingleAudioSelect(audio, callback)
            });
        };

        //打开单视频选择对话框
        this.openSingleVideoSelectDialog = function (video, callback) {

            ngDialog.open({
                plain: true,
                template: tplSingleVideoSelect,
                className: 'ngdialog-theme-default',
                width: '980px',
                controller: ctrlSingleVideoSelect(video, callback)
            });
        };

        //打开多视频选择对话框
        this.openMultipleVideoSelectDialog = function (videos, callback) {
            ngDialog.open({
                plain: true,
                template: tplMultipleVideoSelect,
                className: 'ngdialog-theme-default',
                width: '1200px',
                controller: ctrlMultipleVideoSelect(videos, callback)
            });
        };

    }]);

};
