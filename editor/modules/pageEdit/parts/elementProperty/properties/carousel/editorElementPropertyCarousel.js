var clear = require('../../../../../../../libs/array').clear;

var tplHtml = require('./editorElementPropertyCarousel.html');

module.exports = function (app) {

    app.directive('editorElementPropertyCarousel', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {
                //弹框选择多张图片
                $scope.showDialogForSelectMultipleImage = function () {

                    var images = $scope.data.images;

                    $scope.$emit('on-select-multiple-image', images, function (newImages) {
                        var oldImages = images.slice(0);

                        editorRedoUndoService.saveAndExecRedo(function () {
                            clear(images);//清空
                            newImages.forEach(function (image) {
                                images.push(image);
                            });
                        }, function () {
                            clear(images);//清空
                            oldImages.forEach(function (image) {
                                images.push(image);
                            });
                        }, $scope);
                    });

                };

                //当动画变化时
                $scope.animationChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.animation.inId = newVal.inId;
                        data.animation.outId = newVal.outId;
                    }, function () {
                        data.animation.inId = oldVal.inId;
                        data.animation.outId = oldVal.outId;
                    }, $scope);
                };

                //当特效开关变化时
                $scope.disableAnimationChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.disableAnimation = !newVal;
                    }, function () {
                        data.disableAnimation = !oldVal;
                    }, $scope);
                };

                //当图片停留时间变化时
                $scope.stayChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.stay = newVal;
                    }, function () {
                        data.stay = oldVal;
                    }, $scope);
                };

                //当动画持续时间变化时
                $scope.durationChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.duration = newVal;
                    }, function () {
                        data.duration = oldVal;
                    }, $scope);
                };
            }]
        };
    });

};
