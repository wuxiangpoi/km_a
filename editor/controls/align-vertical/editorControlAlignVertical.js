var tplHtml = require('./editorControlAlignVertical.html');

module.exports = function (app) {

    app.directive('editorControlAlignVertical', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                align: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                //垂直对齐
                $scope.aligns = [
                    {name: "居上", icon: 'icon-chuizhijushang', value: "top"},
                    {name: "居中", icon: 'icon-chuizhijuzhong', value: "middle"},
                    {name: "居下", icon: 'icon-chuizhijuxia', value: "bottom"}
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
