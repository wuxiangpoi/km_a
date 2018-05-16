module.exports = function (args, callback) {

    return ['$scope', 'editorResourceService', function ($scope, editorResourceService) {

        $scope.name = args.name || '';
        $scope.pages = args.pages;
        $scope.oid = args.oid;
        (function () {
            //动态获取总时长
            $scope.getTotalTimes = function () {
                return editorResourceService.getPagesTotalTime(args.pages);
            };

            $scope.resourceCount = editorResourceService.getResourceCountFromPages(args.pages);
            $scope.resourceSize = editorResourceService.getResourceTotalSizeFromPages(args.pages);

        })();
        (function () {
            $scope.pagesSeconds = args.pages.map(function (page) {
                return editorResourceService.getPageSuggestTime(page);
            });
        })();

        $scope.pixelHorizontal = args.pixelHorizontal;
        $scope.pixelVertical = args.pixelVertical;

        //群组
        $scope.$on('emitGroupLeaf', function (e, data) {
            //$scope.currentGroup = data;
            $scope.oid = data.id;
        });

        //确定按钮
        $scope.ensureClick = function () {
            var name = $scope.name;
            if (!name) {
                layer.alert('请填写节目名称！');
                return;
            }

            //有任何场景的时长小于等于0或大于一天是不被允许的
            if ($scope.pages.some(function (page) {
                    return page.stay <= 0 || page.stay > 86400;
                })) {
                layer.alert('每个场景播放时长必须大于 0 且小于 86400 秒(24小时)！');
                return;
            }

            // if (!$scope.oid) {
            //     layer.alert('请选择所属群组！');
            //     return;
            // }
            callback(name, $scope.oid || '', function () {
                $scope.closeThisDialog();
            });
        };

        //关闭弹窗
        $scope.close_dialog = function () {
            $scope.closeThisDialog(); //关闭弹窗
        };

        //输入验证
        $scope.validInput = function ($event) {
            var which = $event.which;
            if (which !== 8 && which !== 46//BackSpace键和Delete键
                && which !== 37 && which !== 38 && which !== 39 && which !== 40//小键盘上下左右键
                && (!(which >= 48 && which <= 57) && !(which >= 96 && which <= 105))//数字0-9
            ) {
                $event.preventDefault();
            }
        };

    }];
};