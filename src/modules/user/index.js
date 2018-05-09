import './style.less';
import userSaveTpl from '../../tpl/user_save.html';
import resetPasswordTpl from "../../tpl/reset_password.html"

const userController = ($scope, baseService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};

	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.admin + 'getAdminPageList');
	}
	$scope.save = (item) => {
		let postData = {
			id: item ? item.id : '',
			account: item ? item.account : '',
			name: item ? item.name : '',
			role: item ? item.role : '',
			contact: item ? item.contact : '',
			phone: item ? item.phone : '',
			email: item ? item.email : '',
			domains: item ? item.domains : []                
		}
		baseService.confirmDialog(540,item ? '编辑帐号' : '添加帐号', item, userSaveTpl, (vm) => {
			if (vm.modalForm.$valid) {
				var onData = postData;
                    if (!item) {
                        onData.password = baseService.md5_pwd($('#userPsd').val());
                    }
				let url = item ? 'modifyDomain' : 'addDomain';
				baseService.postData(baseService.api.domain + url, postData, (res) => {
					baseService.alert(item ? '编辑成功' : '添加成功', 'success');
					vm.closeThisDialog();
					$scope.callServer($scope.tableState);
				})
			} else {
				vm.isShowMessage = true;
			}

		}, function (vm) {
			vm.roles = [];
			baseService.getJson(baseService.api.admin + 'getAdminRoleInfoList ', {}, function (data) {
				vm.roles = data;
			})
		})
	}

	$scope.changeEnabled = function (item, index) {
		baseService.confirm(item.enabled == 0 ? '解禁账户' : '禁用账户', item.enabled == 0 ? '您确定解禁管理员：' + item.name : '您确定禁用管理员：' + item.name, true,
			(vm) => {
				let me = this;
				baseService.postData(baseService.api.admin + 'setAdminEnable', {
					uid: item.id,
					enabled: item.enabled == 0 ? 1 : 0
				}, (res) => {
					baseService.alert('操作成功', 'success');
					vm.closeThisDialog();
					$scope.callServer($scope.tableState);
				})
			})
	}
	$scope.resetPwd = function (item) {
		baseService.confirmDialog(540, '重置密码', {}, resetPasswordTpl, function (vm) {
			if(vm.modalForm.$valid){
				vm.isPosting = true;
				baseService.postData(baseService.api.admin + 'resetPwd', {
					uid: item.id,
					password: baseService.md5_pwd(vm.data.password)
				}, function (data) {
					vm.closeThisDialog();
					vm.isPosting = false;
					baseService.alert("操作成功", 'success');
				});
			}else {
				vm.isShowMessage = true;
			}
			
		})
	}
}

userController.$inject = ['$scope', 'baseService'];

export default angular => {
	return angular.module('userModule', []).controller('userController', userController);
}