import './style.less';
import userSaveTpl from '../../tpl/user_save.html';
import resetPasswordTpl from "../../tpl/reset_password.html"
import relatedDomainTpl from "../../tpl/related_domain.html"

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
	$scope.initPage = function(){
		$scope.callServer($scope.tableState, 0)
	}
	baseService.getJson(baseService.api.admin + 'getAdminRoleInfoList ', {}, function (data) {
		$scope.roleOptions = [{
			name: '角色',
			val: ''
		}];
		for(let i = 0; i < data.length; i ++){
			$scope.roleOptions.push({
				name: data[i].name,
				val: data[i].id
			})
		}
	})
	$scope.roleStatusOptions = [
		{
			val: '',
			name: '状态'
		},
		{
			val: 1,
			name: '激活'
		},
		{
			val: 0,
			name: '禁用'
		}
	]
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
		baseService.confirmDialog(540,item ? '编辑账号' : '添加账号', postData, userSaveTpl, (vm) => {
			if (vm.modalForm.$valid) {
				var onData = postData;
                    if (!item) {
                        onData.password = baseService.md5_pwd($('#userPsd').val());
                    }
				baseService.postData(baseService.api.admin + 'saveAdmin', postData, (res) => {
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
			vm.chooseDomain = function () {
				baseService.confirmDialog(640, '选择关联企业', {}, relatedDomainTpl, function (vm1) {
					postData.domains = vm1.domains;
					vm1.closeThisDialog();
				}, function (vm1) {
					function getDomainList(domains){
						if(domains.length){
							baseService.getJson(baseService.api.admin + 'getDomainList',{
								domains: domains
							},function(domainsList){
								vm1.domainsList = domainsList;
							})
						}
					}
					vm1.displayed = [];
					vm1.sp = {};
					vm1.tableState = {};
					vm1.domains = item ? item.domains : [];
					vm1.domainsList = [];
					vm1.callServer = function (tableState) {
						baseService.initTable(vm1, tableState, baseService.api.domain + 'getDomainPageList');
					}
					vm1.initPage = function () {
						vm1.tableState.pagination.start = 0;
						vm1.callServer(vm1.tableState);
					}
					getDomainList(vm1.domains);
					vm1.addClick = function(domain){
						vm1.domains.push(domain.key);
						vm1.domainsList.push(domain);
					}
					vm1.del = function (item) {
						vm1.domainsList = baseService.removeAryId(vm1.domainsList, item.id);
						vm1.domains = baseService.removeAry(vm1.domains, item.key);
					}
				})
			}
		})
	}
	$scope.getDomains = function(item){
		item.tips = [];
		baseService.getJson(baseService.api.admin + 'getDomainList',{
			domains: item.domains
		},function(domainsList){
			item.tips = domainsList;
		})
	}
	$scope.changeEnabled = function (item, index) {
		baseService.confirm(item.enabled == 0 ? '解禁账户' : '禁用账户', item.enabled == 0 ? '您确定解禁此账号：' + item.name : '您确定禁用此账号：' + item.name,
			(vm) => {
				let me = this;
				vm.isPosting = true;
				baseService.postData(baseService.api.admin + 'setAdminEnable', {
					uid: item.id,
					enabled: item.enabled == 0 ? 1 : 0
				}, (res) => {
					vm.isPosting = false;
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