module.exports = function (app) {
    //自定义 input 事件
    app.directive('ngInput', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elements, attrs) {
                var func = $parse(attrs['ngInput']);
                var inputHandler = function ($event) {
                    scope.$apply(function () {
                        func(scope, {$event: $event});
                    });
                };

                var dom = elements[0];
                dom.addEventListener('input', inputHandler, false);
                //销毁时移除事件
                scope.$on('$destroy', function () {
                    dom.removeEventListener('input', inputHandler, false);
                });
            }
        };
    }]);
};
