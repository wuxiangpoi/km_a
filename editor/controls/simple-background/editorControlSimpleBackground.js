var tplHtml = require('./editorControlSimpleBackground.html');

module.exports = function (app) {

    app.directive('editorControlSimpleBackground', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                backGround: '=',
                onColorChange: '&',
                onTypeChange: '&'
            },
            controller: ['$scope', function ($scope) {

                $scope.id = 'editorBackgroundCheck_' + Math.ceil(Math.random() * 1000000);

                //当背景颜色变化时
                $scope.backGroundColorChange = function (newVal, oldVal) {
                    if ($scope.onColorChange) {
                        $scope.onColorChange({
                            newVal: newVal,
                            oldVal: oldVal
                        });
                    }
                };

                //当背景类别变化时
                $scope.backGroundTypeChange = function (newType) {
                    if ($scope.onTypeChange) {
                        $scope.onTypeChange({
                            newVal: newType,
                            oldVal: newType === 0 ? 1 : 0
                        });
                    }
                };

            }]
        };
    });

};
