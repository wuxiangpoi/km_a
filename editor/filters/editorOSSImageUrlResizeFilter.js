module.exports = function (app) {

    //OSS图片裁减
    app.filter('editorOSSImageUrlResizeFilter', function () {
        return function (imgUrl, size) {
            var joinChar = imgUrl.indexOf('?') >= 0 ? '&' : '?';
            return imgUrl + joinChar + 'x-oss-process=image/resize,m_lfit,h_' + size + ',w_' + size;
        };
    });

};