module.exports = function (app) {

    app.filter('editorElementBorderStyle', function () {
        return function (border, pixelHorizontal, pixelVertical) {

            var referencePixel = pixelHorizontal > pixelVertical ? pixelHorizontal : pixelVertical;

            var borderWidthUnit = referencePixel / 1000;

            var color = border.color;

            return {
                'padding': border.padding * borderWidthUnit + 'px',
                'border': border.style + ' ' + border.width * borderWidthUnit + 'px rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + border.opacity / 100 + ')',
                'border-radius': border.radius * borderWidthUnit + 'px'
            };
        };
    });

};
