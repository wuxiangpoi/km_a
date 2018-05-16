var tplHtml = require('./editorElementWebview.html');

module.exports = function (app) {

    app.directive('editorElementWebview', function () {
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
