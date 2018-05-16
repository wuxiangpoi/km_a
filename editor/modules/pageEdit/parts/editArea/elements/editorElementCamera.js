var tplHtml = require('./editorElementCamera.html');

module.exports = function (app) {

    app.directive('editorElementCamera', function () {
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
