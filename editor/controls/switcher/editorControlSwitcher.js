var tplHtml = require('./editorControlSwitcher.html');

module.exports = function (app) {

    app.directive('editorControlSwitcher', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                isOn: '=',
                isOff: '=',
                onChange: '&'
            },
            link: function (scope, elements, attrs) {
                var func = function () {
                    if (typeof scope.isOn === 'boolean') {
                        //scope.isOn = !scope.isOn;
                        scope.$apply(function () {
                            scope.isOn = !scope.isOn;
                            if (scope.onChange) {
                                scope.onChange({
                                    newVal: scope.isOn,
                                    oldVal: !scope.isOn
                                });
                            }
                        });
                    } else if (typeof scope.isOff === 'boolean') {
                        //scope.isOff = !scope.isOff;
                        scope.$apply(function () {
                            scope.isOff = !scope.isOff;
                            if (scope.onChange) {
                                scope.onChange({
                                    newVal: !scope.isOff,
                                    oldVal: scope.isOff
                                });
                            }
                        });
                    }
                };
                elements.bind('click', func);
                //销毁时移除事件
                scope.$on('$destroy', function () {
                    elements.unbind('click', func);
                });
            }
        };
    });

};
