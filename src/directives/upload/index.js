import template from './template.html';

import './style.less';

export default app => {
    app.directive('kmUpload', ['baseService', 'FileUploader','$rootScope', (baseService, FileUploader,$rootScope) => {
        let link = ($scope, element, attrs) => {
            $scope.isShow = false;
            $scope.isHide = false;
            $scope.uploader = new FileUploader();
            $scope.isShowDialog = function (isShow) {
                $scope.isShow = isShow;
            }
            $scope.isHideDialog = function () {
                $scope.isHide = !$scope.isHide;
            }
            $scope.$on("callUploader", function (event, data,beforeUpload) {
                $scope.uploader.queue = $scope.uploader.queue.concat(data.queue);
                $scope.isShow = true;
                for (let i = 0; i < data.queue.length; i++) {
                    let item = data.queue[i];
                    beforeUpload(item);
                }
            });
            $scope.removeItem = function (item, index, $event) {
                item.cancel();
                $scope.uploader.queue.splice(index, 1);
                $($event.currentTarget).parents('tr').remove();
            }
            $scope.uploader.onCompleteAll = function () {
                $scope.isShow = false;
            };
            $scope.upload = function (item) {
                beforeUpload(item);
            };
            $scope.uploadAll = function () {
                $scope.uploader.uploadAll();
            };
        }
        return {
            restrict: 'AE',
            replace: true,
            template: template,
            link: link
        }
    }])
};