import angular from 'angular';
import template from './template.html';
import style from './style.less';

let controller = ($scope,baseService,userService) => {
    let postData = {
        password: '',
        newPassword: '',
        reNewPassword: ''
    }
    // userService.getUserSrc(function (userData) {
        
    // });
    $scope.updatePwd = function () {
        baseService.confirmDialog(540, '修改密码', postData, 'tpl/update_password.html', function (ngDialog, vm) {
            if (vm.updatePwdForm.$valid && postData.newPassword == postData.reNewPassword) {
                var updpostData = {
                    password: baseService.md5_pwd(vm.data.password),
                    newPassword: baseService.md5_pwd(vm.data.newPassword),
                    reNewPassword: baseService.md5_pwd(vm.data.reNewPassword)
                }
                userService.updatePwd(updpostData, function () {
                    ngDialog.close();
                    baseService.alert('修改成功', 'success');
                })
            } else {
                vm.isShowMessage = true;
            }
        })
    }
    $scope.logout = function () {
        baseService.confirm('退出', '是否退出登录？', function (ngDialog) {
            baseService.goToUrl('/login')
        })
    }
    $scope.toggleFullwidth = function () {
        $('body').toggleClass('toggleFullwidth');
    }
}
controller.$inject = ['$scope','baseService','userService'];

export default app => {
    app.directive('headerBar', () => {
        return {
            restrict: 'E',
            replace: true,
            template: template,
            controller: controller
        }
    })
};