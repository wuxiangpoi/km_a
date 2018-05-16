//转换播放时长
function transformDuration(durationStr) {
    var arr = durationStr.split(':');
    var arr2 = arr.map(function (item) {
        return window.parseInt(item, 10);
    });
    return arr2[0] * 3600 + arr2[1] * 60 + arr2[2];
}

function transformAudio(audio) {
    return {
        ver: 1,
        path: audio.path,
        name: audio.name,
        duration: transformDuration(audio.duration),
        size: audio.size,
        bitrate: audio.bitrate,
        mime: audio.mime,
        ac: audio.ac,
        md5: audio.md5,
        createTime: audio.createTime,
        url: audio.url
    };
}

module.exports = function (app) {

    app.service('audioService', ['dmbdRest', function (dmbdRest) {

        this.converter = transformAudio;

        //获取列表
        this.getAudioList = function (data, success) {
            var apiUrl = '/api/material/getMaterialList4editor';
            return dmbdRest.get(apiUrl, {
                type: 2,
                oid: data.oid,
                gid: data.gid,
                search: data.search,
                start: data.pageSize * data.pageIndex,
                length: data.pageSize
            }, function (content) {
                var audios = content.data.map(function (audio) {
                    return transformAudio(audio);//转换数据为需要的格式
                });
                success(audios, content.recordsTotal);
            });
        };

    }]);

};