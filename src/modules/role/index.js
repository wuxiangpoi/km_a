import './style.less';

const roleController = ($scope, baseService) => {
		$scope.displayed = [];
		$scope.sp = {};
		$scope.tableState = {};
		
		$scope.callServer = function (tableState,page) {
			if(baseService.isRealNum(page)){
				$scope.tableState.pagination.start = page * $scope.sp.length;
			}
            baseService.initTable($scope, tableState, baseService.api.admin + 'getAdminRoleInfoPage');
		}
		$scope.save = (item) => {
			baseService.confirmDialog(item ? '编辑企业' : '添加企业', item, domainSaveTpl, (vm) => {
				if (vm.modalForm.$valid) {
					postData.key = postData.key.toLowerCase();
					// domainService.savedomain(item ? 'modifyDomain' : 'addDomain', postData, function () {
					// 	ngDialog.close();
					// 	baseService.alert(item ? '编辑成功' : '添加成功', 'success');
					// 	$scope.callServer($scope.tableState);
					// })
				} else {
					vm.isShowMessage = true;
				}
	
			}, function (vm) {
				
			})
		}
		
		$scope.changeEnabled = function (item, index) {
			baseService.confirm(item.status == 0 ? '启用企业' : '冻结企业', '您确定' + (item.status == 0 ? '启用' : '冻结') +
				'企业：' + item.name + '?',true,
				(vm) => {
					let me = this;
					baseService.postData(baseService.api.domain + 'setDomainStatus',{
						did: item.id,
						status: item.status == 1 ? 0 : 1
					},(res)=>{
						baseService.alert('操作成功','success');
						vm.$hide();
						$scope.callServer($scope.tableState,0);
					})
				})
		}
}

roleController.$inject = ['$scope', 'baseService'];

export default angular => {
	return angular.module('roleModule', []).controller('roleController', roleController);
}