var tplHtml = require('./editorThumbSerie.html');

module.exports = function (app) {

    //页面缩略图指令
    app.directive('editorThumbSerie', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '='
            },
            controller: ['$scope', function ($scope) {
                
            }]
        };
    });

};