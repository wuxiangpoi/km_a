var find = require('../../../libs/array').find;
var tplHtml = require('./editorControlAnimation.html');

module.exports = function (app) {

    app.directive('editorControlAnimation', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                animation: '=',
                onChange: '&',
            },
            controller: ['$scope', function ($scope) {
                //动画
                $scope.animations = [
                    {name: "向左覆盖", inAnimId: 1, outAnimId: 1},
                    {name: "向右覆盖", inAnimId: 2, outAnimId: 2},
                    {name: "向下覆盖", inAnimId: 3, outAnimId: 3},
                    {name: "向上覆盖", inAnimId: 4, outAnimId: 4},
                    {name: "淡入淡出", inAnimId: 5, outAnimId: 5}//,
                    //{name: "向左翻转", inAnimId: 6, outAnimId: 6}
                ];

                $scope.changeAnimation = function (anim) {
                    var animation = $scope.animation;

                    if (anim.inAnimId !== animation.inId || anim.outAnimId !== animation.outId) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: {
                                    inId: anim.inAnimId,
                                    outId: anim.outAnimId
                                },
                                oldVal: {
                                    inId: animation.inId,
                                    outId: animation.outId
                                }
                            });
                        }

                        animation.inId = anim.inAnimId;
                        animation.outId = anim.outAnimId;
                    }
                };

                var watcher = $scope.$watch('animation', function (animation) {
                    $scope.curAnim = find($scope.animations, function (item) {
                        return item.inAnimId === animation.inId && item.outAnimId === animation.outId;
                    });
                }, true);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

            }]
        };
    });

};
