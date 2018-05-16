var tplHtml = require('./editorViewWebview.html');

module.exports = function (app) {

    //页面预览指令
    app.directive('editorViewWebview', function () {
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