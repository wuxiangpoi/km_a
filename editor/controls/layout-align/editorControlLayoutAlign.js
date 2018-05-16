var tplHtml = require('./editorControlLayoutAlign.html');

module.exports = function (app) {

    app.directive('editorControlLayoutAlign', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                layout: '=',
                onLeftChange: '&',
                onTopChange: '&'
            },
            controller: ['$scope', function ($scope) {

                //左对齐
                $scope.alignLeft = function () {
                    var layout = $scope.layout;
                    var oldVal = layout.left;
                    if (oldVal !== 0) {
                        if ($scope.onLeftChange) {
                            $scope.onLeftChange({
                                oldVal: oldVal,
                                newVal: 0
                            })
                        }
                    }
                };

                //水平居中对齐
                $scope.alignCenter = function () {
                    var layout = $scope.layout;
                    var oldVal = layout.left;
                    if (oldVal !== (100 - layout.width) / 2) {
                        if ($scope.onLeftChange) {
                            $scope.onLeftChange({
                                oldVal: oldVal,
                                newVal: (100 - layout.width) / 2
                            })
                        }
                    }
                };
                
                //右对齐
                $scope.alignRight = function () {
                    var layout = $scope.layout;
                    var oldVal = layout.left;
                    if (oldVal !== 100 - layout.width) {
                        if ($scope.onLeftChange) {
                            $scope.onLeftChange({
                                oldVal: oldVal,
                                newVal: 100 - layout.width
                            })
                        }
                    }
                };

                //上对齐
                $scope.alignTop = function () {
                    var layout = $scope.layout;
                    var oldVal = layout.top;
                    if (oldVal !== 0) {
                        if ($scope.onTopChange) {
                            $scope.onTopChange({
                                oldVal: oldVal,
                                newVal: 0
                            })
                        }
                    }
                };

                //垂直居中对齐
                $scope.alignMiddle = function () {
                    var layout = $scope.layout;
                    var oldVal = layout.top;
                    if (oldVal !== (100 - layout.height) / 2) {
                        if ($scope.onTopChange) {
                            $scope.onTopChange({
                                oldVal: oldVal,
                                newVal: (100 - layout.height) / 2
                            })
                        }
                    }
                };

                //下对齐
                $scope.alignBottom = function () {
                    var layout = $scope.layout;
                    var oldVal = layout.top;
                    if (oldVal !== 100 - layout.height) {
                        if ($scope.onTopChange) {
                            $scope.onTopChange({
                                oldVal: oldVal,
                                newVal: 100 - layout.height
                            })
                        }
                    }
                };

            }]
        };
    });

};
