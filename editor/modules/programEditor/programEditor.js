var tplHtml = require('./programEditor.html');

var less = require('./programEditor.less');

function isSameArray(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

module.exports = function (app) {

    app.directive('programEditor', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                pages: '=',
                onPreview: '&',
                onSaveProgram: '&',
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
                                    case 83://ctrl+s保存
                                        e.preventDefault();
                                        $scope.saveProgram();
                                        break;
                                    case 79://ctrl+o保存模板
                                        e.preventDefault();
                                        $scope.saveTemplate();
                                        break;
                                    case 80://ctrl+p预览
                                        e.preventDefault();
                                        $scope.goPreview();
                                        break;
                                    case 73://ctrl+i添加场景
                                        e.preventDefault();
                                        $scope.showDialogForSelectTemplate();
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


                //左侧拖拽效果参数
                (function () {
                    var cachePages = [];
                    $scope.sortableOptions = {
                        axis: 'y',
                        start: function () {
                            cachePages.splice(0, cachePages.length);
                            $scope.pages.forEach(function (page) {
                                cachePages.push(page);
                            });
                        },
                        stop: function () {
                            //console.log('stop:此事件发生时数组顺序已调整过来');
                            var scopePages = $scope.pages;
                            if (!isSameArray(cachePages, scopePages)) {//顺序有改变
                                var oldPages = cachePages.map(function (page) {
                                    return page;
                                });
                                var newPages = scopePages.map(function (page) {
                                    return page;
                                });

                                $scope.commitUndoRedo(function () {
                                    scopePages.splice(0, scopePages.length);
                                    newPages.forEach(function (page) {
                                        scopePages.push(page);
                                    });
                                }, function () {
                                    scopePages.splice(0, scopePages.length);
                                    oldPages.forEach(function (page) {
                                        scopePages.push(page);
                                    });
                                });
                            }
                            cachePages.splice(0, cachePages.length);
                        },
                        update: function (event, ui) {
                            //console.log('update:此事件发生时数组顺序尚未调整过来');
                        }
                    };
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

                $scope.currentPage = null;


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

                    $scope.$on('auto-selected-template', function (evt, template) {
                        $scope.pixelHorizontal = template.pixelHorizontal;
                        $scope.pixelVertical = template.pixelVertical;
                        $scope.currentPage = template.page;
                        $scope.$broadcast('editor-page-change', template.page);
                    });

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

                //预览本页
                $scope.goCurrentPreview = function () {
                    var curPage = $scope.currentPage;
                    $scope.onPreview({
                        pixelHorizontal: $scope.pixelHorizontal,
                        pixelVertical: $scope.pixelVertical,
                        pages: curPage ? [curPage] : []
                    });
                };

                //保存模板
                $scope.saveTemplate = function () {
                    $scope.onSaveTemplate({
                        pixelHorizontal: $scope.pixelHorizontal,
                        pixelVertical: $scope.pixelVertical,
                        page: $scope.currentPage
                    });
                };

                //预览
                $scope.goPreview = function () {
                    $scope.onPreview({
                        pixelHorizontal: $scope.pixelHorizontal,
                        pixelVertical: $scope.pixelVertical,
                        pages: $scope.pages
                    });
                };

                //保存节目
                $scope.saveProgram = function () {
                    $scope.onSaveProgram({
                        pixelHorizontal: $scope.pixelHorizontal,
                        pixelVertical: $scope.pixelVertical,
                        pages: $scope.pages
                    });
                };

                //返回
                $scope.goBack = function () {
                    $scope.onBack();
                };

                //页面被选中
                $scope.selectPage = function (page, $event) {
                    $scope.currentPage = page;
                    $scope.$broadcast('editor-page-change', page);
                };


                var programPageThumbList = document.getElementById('programPageThumbList');
                //弹框选择模板
                $scope.showDialogForSelectTemplate = function () {
                    $scope.$emit('on-select-single-page', function (template) {
                        addPage(template.page);
                    });
                };

                function addPage(page) {
                    var pages = $scope.pages;
                    var oldPage = $scope.currentPage;

                    $scope.commitUndoRedo(function () {
                        pages.push(page);
                        $scope.currentPage = page;
                        $scope.$broadcast('editor-page-change', page);
                    }, function () {
                        $scope.currentPage = oldPage;
                        $scope.$broadcast('editor-page-change', oldPage);
                        pages.pop();
                    });

                    window.setTimeout(function () {
                        programPageThumbList.scrollTop = programPageThumbList.scrollHeight - programPageThumbList.clientHeight;
                    }, 50);
                }

                //复制场景
                $scope.copyPage = function (page, $event) {
                    $event.stopPropagation();
                    var newPage = angular.copy(page);
                    addPage(newPage);
                };

                //页面被删除
                $scope.deletePage = function (page, $event) {
                    $event.stopPropagation();

                    var pages = $scope.pages;
                    var oldPage = $scope.currentPage;
                    var index = pages.indexOf(page);

                    $scope.commitUndoRedo(function () {
                        pages.splice(index, 1);//删除该页

                        if (page === oldPage) {//如果是当前选中页
                            if (index === 0) {//如果是第一页
                                $scope.currentPage = pages.length === 0 ? null : pages[0];//选中下一页
                            } else {//不是第一页
                                $scope.currentPage = pages[index - 1];//选中上一页
                            }
                            $scope.$broadcast('editor-page-change', $scope.currentPage);
                        }
                    }, function () {
                        if (page === oldPage) {
                            $scope.currentPage = oldPage;
                        }

                        pages.splice(index, 0, page);
                    });
                };

                //如果页数不为0，默认选中第一页
                if ($scope.pages.length !== 0) {
                    $scope.currentPage = $scope.pages[0];
                }

            }]
        };
    });

};