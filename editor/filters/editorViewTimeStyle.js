var find = require('../../libs/array').find;

module.exports = function (app) {

    app.filter('editorViewTimeStyle', ['editorFontFamilyFilterFilter', function (editorFontFamilyFilter) {
        return function (data, pixelHorizontal, pixelVertical) {

            var maxPixel = pixelHorizontal > pixelVertical ? pixelHorizontal : pixelVertical;

            var fontUnit = maxPixel / 1000;
            var color = data.color;

            var style = {
                'font-size': data.size * fontUnit + 'px',
                'font-family': editorFontFamilyFilter(data.font),
                'color': 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')'
            };

            var horizontalAligns = [
                {name: 'left', value: 0},
                {name: 'center', value: 50},
                {name: 'right', value: 100}
            ];
            var verticalAlign = [
                {name: 'top', value: 0},
                {name: 'middle', value: 50},
                {name: 'bottom', value: 100}
            ];

            var h_find = find(horizontalAligns, function (item) {
                return item.name === data.horizontalAlign;
            });
            h_find = h_find || horizontalAligns[1];
            var v_find = find(verticalAlign, function (item) {
                return item.name === data.verticalAlign;
            });
            v_find = v_find || verticalAlign[1];

            style['left'] = h_find.value + '%';
            style['top'] = v_find.value + '%';
            style['-webkit-transform']
                = style['-moz-transform']
                = style['-ms-transform']
                = style['-o-transform']
                = style['transform']
                = 'translate(-' + h_find.value + '%,-' + v_find.value + '%)';

            return style;
        };
    }]);

};