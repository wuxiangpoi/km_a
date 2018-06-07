import template from './template.html';
import './style.less';

let controller = ($scope,baseService,userService,modalService) => {
    $scope.navInfo = '';
    let postData = {
        password: '',
        newPassword: '',
        reNewPassword: ''
    }
    $scope.$on('$stateChangeSuccess',(event, toState) => {
        $scope.navInfo = toState.info;
    })
    $scope.updatePwd = function () {
        modalService.confirmDialog(540,'修改密码', postData, updatePasswordTpl, function (vm) {
            if (vm.modalForm.$valid && postData.newPassword == postData.reNewPassword) {
                var updpostData = {
                    password: baseService.md5_pwd(vm.data.password),
                    newPassword: baseService.md5_pwd(vm.data.newPassword),
                    reNewPassword: baseService.md5_pwd(vm.data.reNewPassword)
                }
                baseService.saveForm(vm,baseService.api.auth + 'updatePwd', updpostData, (res) => {
                    if(res){
                        vm.closeThisDialog();
                        modalService.alert('修改成功', 'success');
                    }
                    
                })
            } else {
                vm.isShowMessage = true;
            }
        })
    }
    $scope.logout = function () {
        modalService.confirm('退出', '是否退出登录？', (vm) => {
			baseService.saveForm(vm,baseService.api.auth + 'logout', {}, (res) => {
                if(res){
                    vm.closeThisDialog();
                    baseService.goToState('login');
                }
                
			})
		})
        
    }
    
    $scope.toggleFullwidth = function () {
        $('body').toggleClass('mini-navbar');
    }
}
controller.$inject = ['$scope','baseService','userService','modalService'];

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