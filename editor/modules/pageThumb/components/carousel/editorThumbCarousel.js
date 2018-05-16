var tplHtml = require('./editorThumbCarousel.html');

module.exports = function (app) {

    //页面缩略图指令
    app.directive('editorThumbCarousel', function () {
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
