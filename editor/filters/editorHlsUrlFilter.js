module.exports = function (app) {

    app.filter('editorHlsUrlFilter', function () {
        return function (url) {
            var md5Url = md5('kmsz_' + url);

            return 'http://192.168.1.161:8080/hls/v1/' + md5Url + '/hls.m3u8'
        };
    });

};