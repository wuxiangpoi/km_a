module.exports = function (ph, pv, callback) {
    return ['$scope', function ($scope) {
        $scope.pixelHorizontal = ph;
        $scope.pixelVertical = pv;

        //输入验证
        $scope.validInput = function ($event) {
            var which = $event.which;
            if (which !== 8 && which !== 46//BackSpace键和Delete键
                && which !== 37 && which !== 38 && which !== 39 && which !== 40//小键盘上下左右键
                && (!(which >= 48 && which <= 57) && !(which >= 96 && which <= 105))//数字0-9
            ) {
                $event.preventDefault();
            }
        };

        $scope.okClick = function () {
            var pixelHorizontal = $scope.pixelHorizontal;
            var pixelVertical = $scope.pixelVertical;
            if (pixelHorizontal > 9999 || pixelHorizontal < 10 || pixelVertical > 9999 || pixelVertical < 10) {
                layer.alert('分辨率数值应该在 10 至 9999 之间');
                return;
            }
            if (pixelHorizontal !== ph || pixelVertical !== pv) {
                callback(pixelHorizontal, pixelVertical);
            }
            $scope.closeThisDialog();
        };

        $scope.cancelClick = function () {
            $scope.closeThisDialog();
        };
    }];
};