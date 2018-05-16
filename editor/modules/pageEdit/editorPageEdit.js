import {max, min, remove} from '../../../libs/array';

var tplHtml = require('./editorPageEdit.html');

var less = require('./editorPageEdit.less');

var sessionKey = 'editor-cut-copy-parse';

module.exports = function (app) {

    require('./parts/index')(app);

    app.directive('editorPageEdit', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                page: '=',
                isShowGridding: '=',
                autoAnchor: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {

                $scope.currentElement = null;

                //页面被点击(未点到元素上)
                $scope.editAreaClick = function () {
                    $scope.currentElement = null;
                };

                //当前选中场景变换时
                $scope.$on('editor-page-change', function (evt, page) {
                    $scope.currentElement = null;
                });

                //快捷键
                (function () {
                    function onKeyDown(e) {
                        console.log(e.which, e);
                        if (e.which === 46) {//delete键
                            $scope.$apply(function () {
                                e.preventDefault();
                                var curEle = $scope.currentElement;
                                if (curEle) {
                                    deleteElement(curEle);
                                } else {
                                    layer.msg('请选取要删除的控件');
                                }
                            });
                        } else {
                            if (e.ctrlKey && !e.altKey) {//ctrl被按下且alt没被按下
                                $scope.$apply(function () {
                                    switch (e.which) {
                                        case 67://ctrl+c复制
                                            e.preventDefault();
                                            (function () {
                                                var curEle = $scope.currentElement;
                                                if (curEle) {
                                                    var sData = angular.toJson(curEle);
                                                    window.sessionStorage.setItem(sessionKey, sData);
                                                    layer.msg('已复制');
                                                } else {
                                                    layer.msg('请选取要复制的控件');
                                                }
                                            })();
                                            break;
                                        case 88://ctrl+x剪切
                                            e.preventDefault();
                                            (function () {
                                                var curEle = $scope.currentElement;
                                                if (curEle) {
                                                    var sData = angular.toJson(curEle);
                                                    window.sessionStorage.setItem(sessionKey, sData);
                                                    deleteElement(curEle);
                                                    layer.msg('已剪切');
                                                } else {
                                                    layer.msg('请选取要剪切的控件');
                                                }
                                            })();
                                            break;
                                        case 86://ctrl+v粘贴
                                            e.preventDefault();
                                            (function () {
                                                var sData = window.sessionStorage.getItem(sessionKey);
                                                if (sData) {
                                                    try {
                                                        var data = angular.fromJson(sData);
                                                        addElement(data);
                                                        layer.msg('已粘贴');
                                                    } catch (err) {
                                                        console.log('粘贴失败：', err);
                                                        layer.msg('粘贴失败');
                                                    }
                                                } else {
                                                    layer.msg('剪切板无数据');
                                                }
                                            })();
                                            break;
                                        case 68://ctrl+d删除
                                            e.preventDefault();
                                            (function () {
                                                var curEle = $scope.currentElement;
                                                if (curEle) {
                                                    deleteElement(curEle);
                                                } else {
                                                    layer.msg('请选取要删除的控件');
                                                }
                                            })();
                                            break;
                                        case 190://ctrl+>置顶
                                            e.preventDefault();
                                            (function () {
                                                var curEle = $scope.currentElement;
                                                if (curEle) {
                                                    setFront(curEle);
                                                } else {
                                                    layer.msg('请选取要置顶的控件');
                                                }
                                            })();
                                            break;
                                        case 188://ctrl+<置底
                                            e.preventDefault();
                                            (function () {
                                                var curEle = $scope.currentElement;
                                                if (curEle) {
                                                    setBack(curEle);
                                                } else {
                                                    layer.msg('请选取要置底的控件');
                                                }
                                            })();
                                            break;
                                        default :
                                            break;
                                    }
                                });
                            }
                        }
                    }

                    document.addEventListener('keydown', onKeyDown, false);

                    //销毁时清除
                    $scope.$on('$destroy', function () {
                        document.removeEventListener('keydown', onKeyDown, false);
                    });
                })();

                //控件置顶/置底事件总线

                function getOtherLayouts(layout) {
                    var otherLayouts = $scope.page.elements.map(function (item) {
                        return item.layout;
                    });
                    remove(otherLayouts, layout);
                    return otherLayouts;
                }

                function getZIndex(layout) {
                    return layout.zIndex;
                }


                //置顶
                var setFront = function (ele) {
                    var layout = ele.layout;
                    var otherLayouts = getOtherLayouts(layout);
                    var maxZIndexLayout = max(otherLayouts, getZIndex);

                    if (maxZIndexLayout !== null) {
                        var maxZIndex = maxZIndexLayout.zIndex;
                        var oldVal = layout.zIndex;
                        if (oldVal !== maxZIndex + 1) {
                            editorRedoUndoService.saveAndExecRedo(function () {
                                layout.zIndex = maxZIndex + 1;
                            }, function () {
                                layout.zIndex = oldVal;
                            }, $scope);
                        }
                    }
                };

                //置底
                var setBack = function (ele) {
                    var layout = ele.layout;
                    var otherLayouts = getOtherLayouts(layout);
                    var minZIndexLayout = min(otherLayouts, getZIndex);

                    if (minZIndexLayout !== null) {
                        var minZIndex = minZIndexLayout.zIndex;
                        var oldVal = layout.zIndex;
                        if (oldVal !== minZIndex - 1) {
                            editorRedoUndoService.saveAndExecRedo(function () {
                                layout.zIndex = minZIndex - 1;
                            }, function () {
                                layout.zIndex = oldVal;
                            }, $scope);
                        }
                    }
                };

                $scope.$on('editor-set-front', function ($event) {
                    $event.stopPropagation();
                    setFront($scope.currentElement);
                });

                $scope.$on('editor-set-back', function ($event) {
                    $event.stopPropagation();
                    setBack($scope.currentElement);
                });


                $scope.$on('editor-element-add', function ($event, ele) {
                    $event.stopPropagation();
                    addElement(ele);
                });

                $scope.$on('editor-element-delete', function ($event, ele) {
                    $event.stopPropagation();
                    deleteElement(ele);
                });

                function addElement(ele) {
                    var oldPage = $scope.page;
                    var elements = oldPage.elements;
                    var oldEle = $scope.currentElement;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        elements.push(ele);
                        if ($scope.page === oldPage) {
                            $scope.currentElement = ele;
                        }
                    }, function () {
                        elements.pop();
                        if ($scope.page === oldPage) {
                            if ($scope.currentElement === ele) {
                                $scope.currentElement = oldEle;
                            }
                        }
                    }, $scope);
                }

                function deleteElement(ele) {
                    var oldPage = $scope.page;
                    var elements = oldPage.elements;
                    var index = elements.indexOf(ele);

                    editorRedoUndoService.saveAndExecRedo(function () {
                        elements.splice(index, 1);
                        $scope.currentElement = null;
                    }, function () {
                        elements.splice(index, 0, ele);
                        if ($scope.page === oldPage) {
                            if ($scope.currentElement === null) {
                                $scope.currentElement = ele;
                            }
                        }
                    }, $scope);
                }

            }],
            link: function (scope, elements, attrs) {

            }
        };
    });

};