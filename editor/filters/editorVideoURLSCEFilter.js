module.exports = function (app) {

    app.filter('editorVideoURLSCEFilter', ['$sce', function ($sce) {
        return function (videoURL) {
            return $sce.trustAsResourceUrl(videoURL);
        };
    }]);

};
