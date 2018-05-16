module.exports = function (app) {

    app.filter('editorProgramViewStyle', function () {
        return function (scale, pixelHorizontal, pixelVertical) {

            var style = {
                'width': pixelHorizontal + 'px',
                'height': pixelVertical + 'px'
            };

            style['-webkit-transform']
                = style['-moz-transform']
                = style['-o-transform']
                = style['transform']
                = 'translate(-50%,-50%) scale(' + (scale) + ')';

            return style;
        };
    });

};
