var remove = require('../../../libs/array').remove;

module.exports = function (images, callback) {
    return ['$scope', '$rootScope', 'imageService', function ($scope, $rootScope, imageService) {

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
                console.log(data);
                //获取数据
                imageService.getImageList(data, function (data, recordCount) {
                    $scope.recordCount = recordCount;
                    $scope.pageIndex = pageIndex;
                    $scope.images = data;
                });
            }
        })();

        //初始化已选图片
        $scope.selectedImages = [];
        for (var i = 0; i < images.length; i++) {
            $scope.selectedImages.push(images[i]);
        }

        $scope.testCheck = function (image) {
            return $scope.selectedImages.some(function (item) {
                return item.path === image.path;
            });
        };

        //选取图片
        $scope.selectImage = function (image) {
            if ($scope.selectedImages.some(function (item) {
                    return item.path === image.path;
                })) {
                layer.confirm('已选取该图片，是否再次选取？', {
                    btn: ['是', '否']
                }, function () {
                    layer.closeAll('dialog');
                    $scope.$apply(function () {
                        $scope.selectedImages.push(angular.copy(image));
                    });
                });
            } else {
                $scope.selectedImages.push(angular.copy(image));
            }
        };

        //反选图片
        $scope.unSelectImage = function (image) {
            remove($scope.selectedImages, image);
        };

        //确定按钮
        $scope.ensureClick = function () {
            callback($scope.selectedImages);
            $scope.closeThisDialog();
        };

        //关闭弹窗
        $scope.close_dialog = function () {
            $scope.closeThisDialog(); //关闭弹窗
        };
    }];
};