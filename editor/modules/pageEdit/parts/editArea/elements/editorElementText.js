var tplHtml = require('./editorElementText.html');

module.exports = function (app) {

    app.directive('editorElementText', function () {
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
