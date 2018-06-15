import style from './style.less';

const boardDealerController = ($scope, baseService,modalService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.domain + 'getDomainPageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.save = (item) => {
		let postData = {
			id: item ? item.id : '',
			phone: item ? item.phone : '',
			name: item ? item.name : '',
			email: item ? item.email : '',
			key: item ? item.key : '',
			price: item ? item.price : ''
		}
		modalService.confirmDialog(540, item ? '编辑企业' : '添加企业', postData, '/static/tpl/boardDealer_save.html', (vm) => {
			if (vm.modalForm.$valid && vm.data.contractEnd >= vm.data.contractStart) {
				let onData = {
					id: postData.id,
					phone: postData.phone,
					name: postData.name,
					email: postData.email,
					key: postData.key,
					price: postData.price
				}
				let url = item ? 'modifyDomain' : 'addDomain';
				onData.key = postData.key.toLowerCase();
				baseService.saveForm(vm,baseService.api.domain + url, onData, (res) => {
					if(res){
						vm.closeThisDialog();
						modalService.alert(item ? '编辑成功' : '添加成功', 'success');
						$scope.callServer($scope.tableState, 0);
					}
					
				})
			} else {
				vm.isShowMessage = true;
			}

		}, function (vm) {
			
		})
	}
	
	$scope.changeEnabled = function (item, index) {
		modalService.confirm(item.status == 0 ? '启用企业' : '冻结企业', '您确定' + (item.status == 0 ? '启用' : '冻结') +
			'企业：' + item.name + '?',
			(vm) => {
				let me = this;
				baseService.saveForm(vm,baseService.api.domain + 'setDomainStatus', {
					did: item.id,
					status: item.status == 1 ? 0 : 1
				}, (res) => {
					if(res){
						vm.closeThisDialog();
						modalService.alert('操作成功', 'success');
						$scope.callServer($scope.tableState, 0);
					}
					
				})
			})
	}
}

boardDealerController.$inject = ['$scope', 'baseService', 'modalService'];

export default angular => {
	return angular.module('boardDealerModule', []).controller('boardDealerController', boardDealerController);
}