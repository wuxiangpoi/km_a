var remove = require('../../../../../libs/array').remove;

var tplHtml = require('./editorEditArea.html');

var less = require('./editorEditArea.less');

module.exports = function (app) {

    require('./elements/index')(app);

    app.directive('editorEditArea', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                //size: '=',
                //programSize: '=',
                page: '=',
                currentElement: '=',
                isShowGridding: '=',
                autoAnchor: '='
            },
            controller: ['$scope', function ($scope) {

                //点击选中元素
                $scope.selectElement = function (ele, $event) {
                    $event.stopPropagation();
                    var oldEle = $scope.currentElement;
                    if (ele !== oldEle) {
                        $scope.currentElement = ele;
                    }
                };

                //取消元素选中
                $scope.unSelectElement = function ($event) {
                    $event.stopPropagation();
                    var oldEle = $scope.currentElement;
                    if (oldEle !== null) {
                        $scope.currentElement = null;
                    }
                };

                //自动吸附对齐效果事件中转处理
                (function () {
                    $scope.$on('dragStartX', function (event, data) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-start-x', data);
                    });

                    $scope.$on('dragMoveX', function (event) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-move-x');
                    });

                    $scope.$on('dragStartY', function (event, data) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-start-y', data);
                    });

                    $scope.$on('dragMoveY', function (event) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-move-y');
                    });

                    $scope.$on('dragStartN', function (event, data) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-start-n', data);
                    });

                    $scope.$on('dragMoveN', function (event) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-move-n');
                    });

                    $scope.$on('dragStartS', function (event, data) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-start-s', data);
                    });

                    $scope.$on('dragMoveS', function (event) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-move-s');
                    });

                    $scope.$on('dragStartE', function (event, data) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-start-e', data);
                    });

                    $scope.$on('dragMoveE', function (event) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-move-e');
                    });

                    $scope.$on('dragStartW', function (event, data) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-start-w', data);
                    });

                    $scope.$on('dragMoveW', function (event) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-move-w');
                    });

                    $scope.$on('dragEnd', function (event, callback) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-end', callback);
                    });
                })();

            }],
            link: function (scope, elements, attrs) {
                var pNode = elements[0].parentNode;

                function resetSize(pixelHorizontal, pixelVertical) {
                    scope.originalPixel = pixelHorizontal > pixelVertical ? pixelHorizontal : pixelVertical;
                    scope.fontSize = scope.originalPixel / 100;
                    //var ts = scope.originalPixel / 2000;
                    var ts = 1;

                    if (pixelHorizontal / pixelVertical < pNode.clientWidth / pNode.clientHeight) {
                        if (pixelHorizontal > pixelVertical) {
                            var scale = pixelHorizontal / pixelVertical * ts;
                            scope.size = pNode.clientHeight * scale;
                            scope.programSize = pNode.clientHeight * scale;
                        } else {
                            scope.size = pNode.clientHeight * ts;
                            scope.programSize = pNode.clientHeight * ts;
                        }
                    } else {
                        if (pixelHorizontal > pixelVertical) {
                            scope.size = pNode.clientWidth * ts;
                            scope.programSize = pNode.clientWidth * ts;
                        } else {
                            var scale = pixelVertical / pixelHorizontal * ts;
                            scope.size = pNode.clientWidth * scale;
                            scope.programSize = pNode.clientWidth * scale;
                        }
                    }
                }

                function onResize(event) {
                    scope.$apply(function () {
                        resetSize(scope.pixelHorizontal, scope.pixelVertical);
                    });
                }

                scope.$on('resize', function () {
                    resetSize(scope.pixelHorizontal, scope.pixelVertical);
                });
                window.addEventListener('resize', onResize, false);

                var watcher = scope.$watchGroup(['pixelHorizontal', 'pixelVertical'], function (args) {
                    var pixelHorizontal = args[0];
                    var pixelVertical = args[1];
                    resetSize(pixelHorizontal, pixelVertical);
                });

                //销毁时移除事件
                scope.$on('$destroy', function () {
                    watcher();//清除监视
                    window.removeEventListener('resize', onResize, false);
                });

            }
        };
    });

};
