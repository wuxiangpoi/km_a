var tplHtml = require('./editorControlAlignHorizontal.html');

module.exports = function (app) {

    app.directive('editorControlAlignHorizontal', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                align: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                //水平对齐
                $scope.aligns = [
                    {name: "居左", icon: 'icon-zuoduiqi', value: "left"},
                    {name: "居中", icon: 'icon-juzhongduiqi', value: "center"},
                    {name: "居右", icon: 'icon-zuo-youduiqi', value: "right"}
                ];

                $scope.changeAlign = function (align) {
                    if (align.value !== $scope.align) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: align.value,
                                oldVal: $scope.align
                            });
                        }
                        $scope.align = align.value;
                    }
                };
            }]
        };
    });

};
