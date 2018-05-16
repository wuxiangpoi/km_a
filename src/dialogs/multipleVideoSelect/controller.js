var remove = require('../../../libs/array').remove;

module.exports = function (videos, callback) {
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

        //右侧拖拽效果参数
        (function () {
            $scope.sortableOptions = {
                axis: 'y'
            };
        })();

        //查询翻页部分
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

        //初始化已选视频
        $scope.selectedVideos = [];
        for (var i = 0; i < videos.length; i++) {
            $scope.selectedVideos.push(videos[i]);
        }

        $scope.testCheck = function (video) {
            return $scope.selectedVideos.some(function (item) {
                return item.path === video.path;
            });
        };

        //选取视频
        $scope.selectVideo = function (video) {
            if ($scope.selectedVideos.some(function (item) {
                    return item.path === video.path;
                })) {
                layer.confirm('已选取该视频，是否再次选取？', {
                    btn: ['是', '否']
                }, function () {
                    layer.closeAll('dialog');
                    $scope.$apply(function () {
                        $scope.selectedVideos.push(angular.copy(video));
                    });
                });
            } else {
                $scope.selectedVideos.push(angular.copy(video));
            }
        };

        //反选视频
        $scope.unSelectVideo = function (video) {
            remove($scope.selectedVideos, video);
        };

        //确定按钮
        $scope.ensureClick = function () {
            callback($scope.selectedVideos);
            $scope.closeThisDialog();
        };

        //关闭弹窗
        $scope.close_dialog = function () {
            $scope.closeThisDialog(); //关闭弹窗
        };
    }];
};