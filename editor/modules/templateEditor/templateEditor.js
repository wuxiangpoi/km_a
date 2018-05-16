var tplHtml = require('./templateEditor.html');

var less = require('./templateEditor.less');


module.exports = function (app) {

    app.directive('templateEditor', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                page: '=',
                onPreview: '&',
                onSaveTemplate: '&',
                onBack: '&',
                //切换分辨率时
                onCheckPixel: '&'
            },
            controller: ['$scope', function ($scope) {

                //快捷键
                (function () {
                    function onKeyDown(e) {
                        //console.log(e.which, e);
                        if (e.which === 27) {
                            $scope.$apply(function () {
                                e.preventDefault();
                                $scope.goBack();
                            });
                        } else if (e.ctrlKey && !e.altKey) {//ctrl被按下且alt没被按下
                            $scope.$apply(function () {
                                switch (e.which) {
                                    case 66://ctrl+b启停自动停靠
                                        e.preventDefault();
                                        $scope.changeAutoAnchor();
                                        break;
                                    case 90://ctrl+z撤销
                                        e.preventDefault();
                                        $scope.undo();
                                        break;
                                    case 89://ctrl+y重做
                                        e.preventDefault();
                                        $scope.redo();
                                        break;
                                    case 71://ctrl+g网格开关
                                        e.preventDefault();
                                        $scope.changeGriddingState();
                                        break;
                                    case 79://ctrl+o保存模板
                                        e.preventDefault();
                                        $scope.saveTemplate();
                                        break;
                                    case 80://ctrl+p预览
                                        e.preventDefault();
                                        $scope.goPreview();
                                        break;
                                    default :
                                        break;
                                }
                            });
                        }
                    }

                    document.addEventListener('keydown', onKeyDown, false);

                    //销毁时清除
                    $scope.$on('$destroy', function () {
                        document.removeEventListener('keydown', onKeyDown, false);
                    });
                })();


                //撤销/重做
                (function () {

                    var undos = $scope.undos = [];
                    var redos = $scope.redos = [];

                    //撤销
                    function undo() {
                        if (undos.length !== 0) {
                            var action = undos.pop();
                            action.undo();
                            redos.push(action);
                        }
                    }

                    //重做
                    function redo() {
                        if (redos.length !== 0) {
                            var action = redos.pop();
                            action.redo();
                            undos.push(action);
                        }
                    }

                    //撤销
                    $scope.undo = undo;

                    //重做
                    $scope.redo = redo;

                    //记录操作并执行动作
                    $scope.commitUndoRedo = function (redo, undo) {
                        redos.splice(0, redos.length);
                        var action = {
                            undo: undo,
                            redo: redo
                        };
                        undos.push(action);
                        redo();
                    };

                    $scope.$on('undo-redo-save', function (e, redo, undo) {
                        $scope.commitUndoRedo(redo, undo);
                    });

                })();

                //屏幕分辨率
                (function () {

                    $scope.pixelChange = function (ph, pv) {
                        var oldPixelHorizontal = $scope.pixelHorizontal;
                        var oldPixelVertical = $scope.pixelVertical;

                        $scope.commitUndoRedo(function () {
                            $scope.pixelHorizontal = ph;
                            $scope.pixelVertical = pv;
                        }, function () {
                            $scope.pixelHorizontal = oldPixelHorizontal;
                            $scope.pixelVertical = oldPixelVertical;
                        });
                    };

                })();

                //启用/停用自动停靠
                (function () {
                    $scope.autoAnchor = true;//默认启用
                    $scope.changeAutoAnchor = function () {
                        $scope.autoAnchor = !$scope.autoAnchor;
                        layer.msg($scope.autoAnchor ? '已启用自动吸附' : '已关闭自动吸附');
                    };
                })();

                //显示/隐藏网格
                (function () {
                    $scope.isShowGridding = false;//默认不显示
                    $scope.changeGriddingState = function () {
                        $scope.isShowGridding = !$scope.isShowGridding;
                    };
                })();

                //预览
                $scope.goPreview = function () {
                    $scope.onPreview({
                        pixelHorizontal: $scope.pixelHorizontal,
                        pixelVertical: $scope.pixelVertical,
                        pages: [$scope.page]
                    });
                };

                //保存模板
                $scope.saveTemplate = function () {
                    $scope.onSaveTemplate({
                        pixelHorizontal: $scope.pixelHorizontal,
                        pixelVertical: $scope.pixelVertical,
                        page: $scope.page
                    });
                };

                //返回
                $scope.goBack = function () {
                    $scope.onBack();
                };

            }]
        };
    });

};