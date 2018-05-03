import angular from 'angular';
import template from './template.html';
import './style.less';
import updatePasswordTpl from '../../tpl/update_password.html';

let controller = ($scope,baseService,userService) => {
    let postData = {
        password: '',
        newPassword: '',
        reNewPassword: ''
    }
    
    $scope.updatePwd = function () {
        baseService.confirmDialog('修改密码', postData, updatePasswordTpl, function (vm) {
            if (vm.modalForm.$valid && postData.newPassword == postData.reNewPassword) {
                var updpostData = {
                    password: baseService.md5_pwd(vm.data.password),
                    newPassword: baseService.md5_pwd(vm.data.newPassword),
                    reNewPassword: baseService.md5_pwd(vm.data.reNewPassword)
                }
                m.isPosting = false;
                baseService.postData(baseService.api.auth + 'updatePwd', postData, function (data) {
                    vm.isPosting = false;
                    vm.$hide();
                    baseService.alert('修改成功', 'success');
                })
            } else {
                vm.isShowMessage = true;
            }
        })
    }
    $scope.logout = function () {
        baseService.confirm('退出', '是否退出登录？',true, (vm) => {
			vm.isPosting = true;
			baseService.postData(baseService.api.auth + 'logout', {}, () => {
                vm.isPosting = false;
                vm.$hide();
				baseService.goToState('login');
			})
		})
        
    }
    $scope.toggleFullwidth = function () {
        $('body').toggleClass('mini-navbar');
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