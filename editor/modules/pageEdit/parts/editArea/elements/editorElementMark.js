var tplHtml = require('./editorElementMark.html');

module.exports = function (app) {

    app.directive('editorElementMark', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            transclude: true,
            scope: {
                layout: '=',
                type: '=',
                data: '=',
                fontSize: '=',
                pixelHorizontal: '=',
                pixelVertical: '='
            },
            controller: ['$scope', function ($scope) {

            }]
        };
    });

};
