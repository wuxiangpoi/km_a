module.exports = function (app) {

    app.filter('editorElementBackgroundStyle', function () {
        return function (backGround, border, pixelHorizontal, pixelVertical) {

            var referencePixel = pixelHorizontal > pixelVertical ? pixelHorizontal : pixelVertical;

            var borderWidthUnit = referencePixel / 1000;

            var style = {
                'border-radius': border.radius * borderWidthUnit + 'px',
                'opacity': backGround.opacity / 100
            };

            if (backGround.type === 1) {
                var color = backGround.color;
                style['background'] = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            } else if (backGround.type === 2) {
                if (backGround.image) {
                    style['background'] = "url('" + backGround.image.url + "') no-repeat scroll center center / 100% 100% border-box border-box";
                }
            }

            return style;
        };
    });

};
