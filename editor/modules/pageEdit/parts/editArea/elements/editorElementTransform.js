var tplHtml = require('./editorElementTransform.html');

module.exports = function (app) {

    app.directive('editorElementTransform', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            transclude: true,
            scope: {
                transform: '='
            },
            controller: ['$scope', function ($scope) {

            }]
        };
    });

};
