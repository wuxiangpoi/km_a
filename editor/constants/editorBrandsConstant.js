//海康获取URL
function getUrl_HAIKANG(info) {
    //主码流：
    //rtsp://admin:12345@192.0.0.64:554/h264/ch1/main/av_stream
    //子码流：
    //rtsp://admin:12345@192.0.0.64/h264/ch1/sub/av_stream
    return 'rtsp://'
        + info.account + ':'
        + info.password + '@'
        + info.ip + ':'
        + info.port + '/h264/ch'
        + info.channel + '/'
        + (info.code === 0 ? 'main' : 'sub') + '/av_stream';
}

//大华获取URL
function getUrl_DAHUA(info) {
    //rtsp://admin:admin@10.12.4.84:554/cam/realmonitor?channel=2&subtype=1
    return 'rtsp://'
        + info.account + ':'
        + info.password + '@'
        + info.ip + ':'
        + info.port + '/cam/realmonitor'
        + '?channel=' + info.channel
        + '&subtype=' + info.code;
}

//DLINK获取URL
function getUrl_DLINK(info) {
    //rtsp://admin:12345@192.168.200.201:554/live2.sdp
    return 'rtsp://'
        + info.account + ':'
        + info.password + '@'
        + info.ip + ':'
        + info.port + '/live'
        + info.channel + '.sdp';
}


var data = [
    {name: '海康威视', value: 1, getUrl: getUrl_HAIKANG},
    {name: '大华', value: 2, getUrl: getUrl_DAHUA},
    {name: 'D-Link', value: 3, getUrl: getUrl_DLINK}
];

module.exports = function (app) {

    //时间格式化参数
    app.constant('editorBrandsConstant', data);

};