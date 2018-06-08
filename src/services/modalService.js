import config from '../../configs/config'
let temp = config.temp;
const modalService = (ngDialog, $alert) => {
    return {
        alert: function (info, type) {
            $alert({
                content: info,
                placement: 'top',
                type: type,
                show: true,
                duration: 2
            });
        },
        confirm: function (title, info, cb) {
            ngDialog.openConfirm({
                template: 'static/tpl/confirm.tpl.html' + '?_' + temp,
                cache: false,
                className: 'ngdialog-theme-default',
                controller: ['$scope', function ($scope) {
                    $scope.info = info
                    $scope.title = title
                    $scope.confirm = () => {
                        cb($scope, ngDialog);
                    }

                }],
                width: 540
            })

        },
        confirmDialog(width, title, data, tempUrl, cb, beforeOpen) {
            ngDialog.openConfirm({
                template: tempUrl + '?_' + temp,
                cache: false,
                className: 'ngdialog-theme-default',
                width: width,
                controller: ['$scope', function ($scope) {
                    $scope.data = data
                    $scope.title = title
                    if (beforeOpen) {
                        beforeOpen($scope)
                    }

                    $scope.confirm = function (type) {
                        cb($scope,ngDialog, type);
                    }
                    $scope.cancel = function () {
                        $scope.closeThisDialog()
                    }

                }]
            })
        },
        confirmAlert: function (title, info, type, sInfo, tInfo, cb, link) {
            ngDialog.openConfirm({
                template: '/static/tpl/confirmalert.html' + '?_' + temp,
                cache: false,
                className: 'ngdialog-theme-default',
                controller: ['$scope', function ($scope) {
                    $scope.info = info;
                    $scope.title = title;
                    $scope.type = type;
                    $scope.sInfo = sInfo;
                    $scope.tInfo = tInfo;
                    $scope.link = link;
                    $scope.modalConfirm = function () {
                        $scope.closeThisDialog();
                        if (cb) {
                            cb();
                        }
                    }
                    $scope.cancel = function () {
                        $scope.closeThisDialog();
                    }

                }],
                width: 540
            })
        },
    };

}

modalService.$inject = ['ngDialog', '$alert'];

export default app => {
    app.factory('modalService', modalService)
}