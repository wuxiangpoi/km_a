var tplHtml = require('./editorElementImage.html');

module.exports = function (app) {

    app.directive('editorElementImage', function () {
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
