var tplHtml = require('./editorElementBorder.html');

module.exports = function (app) {

    app.directive('editorElementBorder', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            transclude: true,
            scope: {
                border: '='
            },
            controller: ['$scope', function ($scope) {
                var watcher = $scope.$watch('border', function (border) {
                    switch (border.ver) {
                        case 1:
                            $scope.borderStyle = {
                                'padding': border.padding / 10 + 'em',
                                'border': border.style + ' ' + border.width / 10 + 'em rgba(' + border.color.r + ',' + border.color.g + ',' + border.color.b + ',' + border.opacity / 100 + ')',
                                'border-radius': border.radius / 10 + 'em'
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
