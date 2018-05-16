function transformImage(image) {
    return {
        ver: 1,
        path: image.path,
        name: image.name,
        size: image.size,
        mime: image.mime,
        width: image.width,
        height: image.height,
        createTime: image.createTime,
        url: image.url
    };
}

module.exports = function (app) {

    app.service('imageService', ['dmbdRest', function (dmbdRest) {

        this.converter = transformImage;

        //获取列表
        this.getImageList = function (data, success) {
            //var apiUrl = 'mock/image_list2.json';
            var apiUrl = '/api/material/getMaterialList4editor';
            return dmbdRest.get(apiUrl, {
                type: 0,
                oid: data.oid,
                gid: data.gid,
                search: data.search,
                start: data.pageSize * data.pageIndex,
                length: data.pageSize
            }, function (content) {
                var images = content.data.map(function (image) {
                    return transformImage(image);//转换数据为需要的格式
                });
                success(images, content.recordsTotal);
            });
        };

    }]);

};