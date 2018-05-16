module.exports = function (app) {

    app.filter('editorTypeDescribe', function () {
        return function (type) {
            switch (type) {
                case 100:
                    return '文字';
                case 150:
                    return '走马灯';
                case 160:
                    return '文字';
                case 200:
                    return '单图';
                case 250:
                    return '图片';
                case 300:
                    return '单视频';
                case 350:
                    return '视频';
                case 500:
                    return '时间';
                case  900:
                    return '网页';
                case 1000:
                    return '流媒体';
                case 1100:
                    return '摄像头';
                default:
                    return '未知';
            }
        };
    });

};
