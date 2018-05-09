import angular from 'angular';
import template from './template.html';

import './style.less';

export default app => {
    app.directive('kmUpload', (baseService,FileUploader) => {
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
            $scope.$on("callUploader", function(event, data) {
                $scope.uploader.queue = $scope.uploader.queue.concat(data.queue);
                $scope.isShow = true;
                $scope.uploadAll();               
            });
            $scope.removeItem = function(item,index,$event){
                item.cancel();
                $scope.uploader.queue.splice(index, 1);
                $($event.currentTarget).parents('tr').remove();
            }
            $scope.uploader.onCompleteAll = function () {
                $scope.isShow = false;
                $.apply();
            };
            $scope.upload = function (item) {
                item.upload();
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
    })
};