var tplHtml = require('./editorControlRange.html');

module.exports = function (app) {

    app.directive('editorControlRange', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                minVal: '=',
                maxVal: '=',
                step: '@',
                val: '=',
                onChange: '&'
            },
            link: function (scope, elements, attrs) {
                if (scope.step) {
                    elements[0].setAttribute('step', scope.step);
                }
                var watcher = scope.$watch('val', function (val) {
                    elements[0].value = val;
                });

                var func = function () {
                    var val = parseInt(this.value);
                    scope.$apply(function () {
                        scope.val = val;
                    });
                };

                var oldVal = null;
                var downFunc = function (e) {
                    e.stopPropagation();
                    oldVal = parseInt(this.value);
                };

                var changeFunc = function () {
                    if (scope.onChange) {
                        scope.onChange({
                            newVal: scope.val,
                            oldVal: oldVal
                        });
                    }
                };

                elements.bind('mousedown', downFunc);
                elements.bind('keydown', downFunc);
                elements.bind('change', changeFunc);
                elements.bind('input', func);
                //销毁时移除事件
                scope.$on('$destroy', function () {
                    elements.unbind('input', func);
                    elements.unbind('change', changeFunc);
                    elements.unbind('keydown', downFunc);
                    elements.unbind('mousedown', downFunc);
                    watcher();
                });
            }
        };
    });

};
