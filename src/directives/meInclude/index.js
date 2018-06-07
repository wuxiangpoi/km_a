import angular from 'angular'
export default app => {
    app.directive('meInclude', ['$compile', '$templateRequest', ($compile, $templateRequest) => {
        return {
            replace: true,
            restrict: 'EA',
            link: function (scope, ele, attrs) {
                let DUMMY_SCOPE = {
                        $destroy: angular.noop
                    },
                    childScope,
                    destroyChildScope = function () {
                        (childScope || DUMMY_SCOPE).$destroy();
                    };
                let srcExp = attrs.meInclude || attrs.src;
                srcExp += '?_' + (+new Date());
                scope.$watch("srcExp", () => {
                    if (srcExp) {
                        $templateRequest(srcExp, true).then(res => {
                            destroyChildScope();
                            childScope = scope.$new(false);
                            let content = $compile(res)(childScope);
                            $(ele[0]).append(content);
                        })

                    }

                    scope.$on("$destroy", destroyChildScope);
                });
            }
        }
    }])
};