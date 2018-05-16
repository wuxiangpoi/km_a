module.exports = function (args, callback) {
    return ['$scope', 'editorResourceService', function ($scope, editorResourceService) {

        $scope.name = args.name || '';
        $scope.page = args.page;
        $scope.pixelHorizontal = args.pixelHorizontal;
        $scope.pixelVertical = args.pixelVertical;

        (function () {
            //获取资源总数及大小
            $scope.resourceCount = editorResourceService.getResourceCountFromPages([args.page]);
            $scope.resourceSize = editorResourceService.getResourceTotalSizeFromPages([args.page]);
        })();

        (function () {
            args.page.stay = editorResourceService.getPageSuggestTime(args.page);
        })();

        //确定按钮
        $scope.ensureClick = function () {
            var name = $scope.name;
            if (!name) {
                layer.alert('请填写模板名称！');
                return;
            }
            callback(name, function () {
                $scope.closeThisDialog();
            });
        };

        //关闭弹窗
        $scope.close_dialog = function () {
            $scope.closeThisDialog(); //关闭弹窗
        };
    }];
};