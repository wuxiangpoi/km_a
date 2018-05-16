var tplHtml = require('./editorElementStreamMedia.html');

module.exports = function (app) {

    app.directive('editorElementStreamMedia', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '='
            }
        };
    });

};
