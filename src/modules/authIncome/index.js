import style from './style.less';

const authIncomeController = ($scope, baseService, modalService) => {
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
		modalService.confirmDialog(540, item ? '编辑授权码' : '添加授权码', postData, '/static/tpl/authorization_save.html', (vm) => {
			if (vm.modalForm.$valid) {
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
				baseService.saveForm(vm, baseService.api.domain + url, onData, (res) => {
					if (res) {
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

authIncomeController.$inject = ['$scope', 'baseService', 'modalService'];

export default angular => {
	return angular.module('authIncomeModule', []).controller('authIncomeController', authIncomeController);
}