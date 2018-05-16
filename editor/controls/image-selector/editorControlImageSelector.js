var tplHtml = require('./editorControlImageSelector.html');

module.exports = function (app) {

    app.directive('editorControlImageSelector', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                image: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {

                //添加图片
                $scope.insertImage = function () {
                    $scope.$emit('on-select-single-image', null, function (image) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: image,
                                oldVal: null
                            });
                        }
                        $scope.image = image;
                    });
                };


                //更换图片
                $scope.updateImage = function () {
                    var oldImage = $scope.image;
                    $scope.$emit('on-select-single-image', oldImage, function (image) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: image,
                                oldVal: oldImage
                            });
                        }
                        $scope.image = image;
                    });
                };

                //删除图片
                $scope.deleteImage = function () {
                    if ($scope.onChange) {
                        $scope.onChange({
                            newVal: null,
                            oldVal: $scope.image
                        });
                    }
                    $scope.image = null;
                };
            }]
        };
    });

};
