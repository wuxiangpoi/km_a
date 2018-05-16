function pading2(num) {
    return num < 10 ? '0' + num : num.toString(10);
}

module.exports = function (app) {

    //音频播放时长格式化过滤器
    app.filter('dmbdAudioTimeFormatFilter', function () {
        return function (seconds) {
            return pading2(Math.floor(seconds / 3600))
                + ':' + pading2(Math.floor((seconds % 3600) / 60))
                + ':' + pading2(seconds % 60);
        };
    });

};