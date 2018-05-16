module.exports = function (app) {

    app.filter('editorElementLayoutStyle', function () {
        return function (layout) {
            var rotate_val = 'rotate(' + layout.rotate + 'deg)';

            return {
                'left': layout.left + '%',
                'top': layout.top + '%',
                'width': layout.width + '%',
                'height': layout.height + '%',
                'z-index': layout.zIndex,
                '-webkit-transform': rotate_val,
                '-moz-transform': rotate_val,
                '-o-transform': rotate_val,
                'transform': rotate_val
            };
        };
    });

};
