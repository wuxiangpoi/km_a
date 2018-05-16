var tplHtml = require('./editorElementVideo.html');

module.exports = function (app) {

    app.directive('editorElementVideo', function () {
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
