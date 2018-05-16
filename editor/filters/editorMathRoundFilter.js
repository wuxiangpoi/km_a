module.exports = function (app) {

    app.filter('editorMathRoundFilter', function () {
        return function (num, fix) {
            if (fix === 0 || !fix) {
                return Math.round(num);
            }
            return num.toFixed(fix);
        };
    });

};
