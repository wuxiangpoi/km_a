var find = require('../../libs/array').find;

module.exports = function (app) {

    app.filter('editorFontFamilyFilter', ['editorFontFamilyConstant', function (fonts) {
        return function (fontID) {
            var font = find(fonts, function (font) {
                return font.id === fontID;
            });
            return font ? font.value : fonts[0].value;
        };
    }]);

};
