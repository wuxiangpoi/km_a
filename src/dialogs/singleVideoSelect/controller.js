module.exports = function (video, callback) {
    return ['$scope', '$rootScope', 'videoService', function ($scope, $rootScope, videoService) {

        //var oid = $rootScope.rootGroup.id;
        var oid = null;
        var gid = null;

        (function () {
            $scope.$on('emitGroupLeaf', function (e, group, leaf) {
                oid = group.id;
                if (leaf) {
                    gid = leaf.id;
                }
                $scope.doPaging(0);
            });
        })();

        //翻页部分
        (function () {
            $scope.search = '';
            $scope.pageSize = 10;
            $scope.pageIndex = 0;
            $scope.recordCount = 0;
            $scope.doPaging = doPaging;

            $scope.doQuery = function () {
                doPaging(0);
            };

            doPaging(0);//默认打开第一页

            //执行翻页动作
            function doPaging(pageIndex) {
                var data = {
                    oid: oid || '',
                    gid: gid || '',
                    search: $scope.search.trim(),
                    pageSize: $scope.pageSize,
                    pageIndex: pageIndex
                };
                //获取数据
                videoService.getVideoList(data, function (data, recordCount) {
                    $scope.recordCount = recordCount;
                    $scope.pageIndex = pageIndex;
                    $scope.videos = data;
                });
            }
        })();

        //选取视频
        $scope.chooseVideo = function (video) {
            callback(angular.copy(video));
            $scope.closeThisDialog();
        };

        //关闭弹窗
        $scope.close_dialog = function () {
            $scope.closeThisDialog(); //关闭弹窗
        };
    }];
};