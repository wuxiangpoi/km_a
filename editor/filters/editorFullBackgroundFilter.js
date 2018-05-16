module.exports = function (app) {

    app.filter('editorFullBackgroundFilter', function () {
        return function (imgUrl) {
            return "url('" + imgUrl + "') no-repeat scroll center center / 100% 100% border-box border-box";
        };
    });

};
