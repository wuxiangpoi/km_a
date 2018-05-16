module.exports = function (app) {

    app.service('resourcePathService', ['dmbdRest', function (dmbdRest) {

        //根据资源path获取其对应的文件信息，包括授权后的URL
        this.getMaterialMapByPaths = function (paths, success) {

            var apiUrl = '/api/material/getMaterialMapByPaths';

            dmbdRest.post(apiUrl, {
                paths: angular.toJson(paths)
            }, function (pathMaps) {
                success(pathMaps);
            });

        };

    }]);

};
