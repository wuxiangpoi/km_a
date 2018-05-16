module.exports = function (app) {

    app.filter('editorPageViewBackgroundStyle', ['editorOSSImageUrlResizeFilterFilter', function (editorOSSImageUrlResizeFilter) {
        return function (backGround) {

            var style = {
                'opacity': backGround.opacity / 100
            };

            if (backGround.type === 1) {
                var color = backGround.color;
                style['background'] = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            } else if (backGround.type === 2) {
                if (backGround.image) {
                    style['background'] = "url('" + editorOSSImageUrlResizeFilter(backGround.image.url, 800) + "') no-repeat scroll center center / 100% 100% border-box border-box";
                }
            }

            return style;
        };
    }]);

};
