module.exports = function (app) {

    //尺寸过滤器(文件体积，显示GB、MB、KB等)
    app.filter('dmbdResourceSizeFilter', function () {
        return function (size) {
            if (size < 1024) {
                return size + ' B';
            } else if (size < 1024 * 1024) {
                return (size / 1024).toFixed(2) + ' KB';
            } else if (size < 1024 * 1024 * 1024) {
                return (size / 1024 / 1024).toFixed(2) + ' MB';
            } else if (size < 1024 * 1024 * 1024 * 1024) {
                return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
            } else {
                return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB';
            }
        };
    });
    
};