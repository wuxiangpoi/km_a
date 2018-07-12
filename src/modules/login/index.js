import config from '../../../configs/config'
import CryptoJS from 'crypto-js/crypto-js'

const loginController = ($scope, $rootScope, baseService, userService) => {
    $scope.account = '';
    $scope.password = '';
    $scope.isRemembered = true;
    $scope.isShowMessage = false;
    if ($.cookie('user_cookie') && $.cookie('user_cookie').length != 4) {
        var cookiesData = JSON.parse(CryptoJS.AES.decrypt($.cookie('user_cookie').toString(),config.secret).toString(CryptoJS.enc.Utf8));
        $scope.account = cookiesData.account;
        $scope.password = cookiesData.password;
    }

    $scope.login = function () {
        if ($scope.loginForm.$valid) {
            var postData = {
                account: $scope.account,
                password: baseService.md5_pwd($scope.password)
            }
            userService.login(postData, function (pdata) {
                userService.getUserSrc(function (userData) {
                    $rootScope.userData = userData;
                    baseService.goToState('dashboard.home');
                    if ($scope.isRemembered) {
                        $.cookie('user_cookie', CryptoJS.AES.encrypt(JSON.stringify({
                            domain: $scope.domain,
                            account: $scope.account,
                            password: $scope.password
                        }),config.secret), {
                            expires: 30
                        });
                    } else {
                        $.cookie('user_cookie', null);
                    }

                });
            })
        } else {
            $scope.isShowMessage = true;
        }
    }

}

loginController.$inject = ['$scope', '$rootScope', 'baseService', 'userService'];

export default angular => {
    return angular.module('loginModule', []).controller('loginController', loginController);
}