import style from './style.less';

const boardDealerController = ($scope, baseService,modalService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.boardVendor + 'getBoardVendorPage');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.save = (item) => {
		let postData = {
			id: item ? item.id : '',
			phone: item ? item.phone : '',
			name: item ? item.name : '',
			contact: item ? item.contact: '',
			email: item ? item.email : '',
			key: item ? item.key : ''
		}
		modalService.confirmDialog(540, item ? '编辑企业' : '添加企业', postData, '/static/tpl/boardDealer_save.html', (vm) => {
			if (vm.modalForm.$valid) {
				let onData = {
					id: postData.id,
					phone: postData.phone,
					name: postData.name,
					contact: postData.contact,
					email: postData.email,
					key: postData.key
				}
				baseService.saveForm(vm,baseService.api.boardVendor + 'saveBoardVendor', onData, (res) => {
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
	
}

boardDealerController.$inject = ['$scope', 'baseService', 'modalService'];

export default angular => {
	return angular.module('boardDealerModule', []).controller('boardDealerController', boardDealerController);
}