import angular from 'angular';

export default app => {
    app.directive('meInclude', ['$compile',($compile) => {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                html: '='
            },
            link: ($scope, ele, attrs) => {
                var template = $scope.html;
                // Step 2: compile the template
                var linkFn = $compile(template);
                // Step 3: link the compiled template with the scope.
                var element = linkFn($scope);
                $(ele[0]).append(element[0]);
            }
        }
    }])
};