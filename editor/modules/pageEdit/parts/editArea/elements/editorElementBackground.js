var tplHtml = require('./editorElementBackground.html');

module.exports = function (app) {

    app.directive('editorElementBackground', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                backGround: '=',
                border: '='
            }
        };
    });

};
