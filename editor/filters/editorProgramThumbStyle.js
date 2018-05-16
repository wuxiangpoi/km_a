module.exports = function (app) {

    app.filter('editorProgramThumbStyle', function () {
        return function (programSize, pixelHorizontal, pixelVertical) {
            var programWidth, programHeight;

            if (pixelHorizontal === pixelVertical) {//方屏
                programWidth = programSize;
                programHeight = programSize;
            } else if (pixelHorizontal > pixelVertical) {//横屏
                programWidth = programSize;
                programHeight = programSize * pixelVertical / pixelHorizontal;
            } else {//竖屏
                programWidth = programSize * pixelHorizontal / pixelVertical;
                programHeight = programSize;
            }

            return {
                'width': programWidth + 'px',
                'height': programHeight + 'px'
            };
        };
    });

};
