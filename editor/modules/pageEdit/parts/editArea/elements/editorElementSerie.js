var tplHtml = require('./editorElementSerie.html');

module.exports = function (app) {

    app.directive('editorElementSerie', function () {
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
