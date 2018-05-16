module.exports = function (app) {

    app.filter('editorContainBackgroundFilter', function () {
        return function (imgUrl) {
            return "url('" + imgUrl + "') no-repeat scroll center center / contain border-box border-box";
        };
    });

};
