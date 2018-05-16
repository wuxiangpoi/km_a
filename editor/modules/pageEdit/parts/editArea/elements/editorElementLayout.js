var tplHtml = require('./editorElementLayout.html');

module.exports = function (app) {

    app.directive('editorElementLayout', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            transclude: true,
            scope: {
                layout: '='
            },
            controller: ['$scope', function ($scope) {
                var watcher = $scope.$watch('layout', function (layout) {
                    switch (layout.ver) {
                        case 1:
                            var layoutStyle = {
                                'left': layout.left + '%',
                                'top': layout.top + '%',
                                'width': layout.width + '%',
                                'height': layout.height + '%',
                                'z-index': layout.zIndex
                            };
                            if (layout.rotate % 360 !== 0) {//小优化
                                layoutStyle['-webkit-transform']
                                    = layoutStyle['-moz-transform']
                                    = layoutStyle['-ms-transform']
                                    = layoutStyle['-o-transform']
                                    = layoutStyle['transform']
                                    = 'rotate(' + layout.rotate + 'deg)';
                            }
                            $scope.layoutStyle = layoutStyle;
                            break;
                        default :
                            $scope.layoutStyle = {
                                'left': '0',
                                'top': '0',
                                'width': '100%',
                                'height': '100%',
                                'z-index': '0'
                            };
                            break;
                    }
                }, true);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }]
        };
    });

};
