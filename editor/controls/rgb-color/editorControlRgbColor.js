var tplHtml = require('./editorControlRgbColor.html');

module.exports = function (app) {

    app.directive('editorControlRgbColor', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                rgbColor: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {

                $scope.changeColor = function (color) {
                    var rgb = $scope.rgbColor;
                    var oldR = rgb.r;
                    var oldG = rgb.g;
                    var oldB = rgb.b;
                    var newR = parseInt(color.substr(1, 2), 16);
                    var newG = parseInt(color.substr(3, 2), 16);
                    var newB = parseInt(color.substr(5, 2), 16);
                    rgb.r = newR;
                    rgb.g = newG;
                    rgb.b = newB;

                    if ($scope.onChange) {
                        $scope.onChange({
                            newVal: {
                                r: newR,
                                g: newG,
                                b: newB
                            },
                            oldVal: {
                                r: oldR,
                                g: oldG,
                                b: oldB
                            }
                        });
                    }
                };

                var watcher = $scope.$watch('rgbColor', function (rgb) {
                    var hexStr = ((rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16);
                    hexStr = hexStr.length >= 6 ? hexStr : new Array(6 + 1 - hexStr.length).join('0') + hexStr;
                    $scope.color = '#' + hexStr;
                }, true);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }]
        };
    });

};
