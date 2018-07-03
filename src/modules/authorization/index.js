import style from './style.less';
import {
	terminalExpiredMonthOptions
} from '../../filter/options.js'

const authorizationController = ($scope, baseService, modalService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.boardLicenseKey + 'getBoardLicenseKeyPage');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.save = (item) => {
		let postData = {
			vendorId: item ? item.vendorId : '',
			price: item ? item.price : '',
			months: '12',
			quantity: item ? item.quantity : ''
		}
		modalService.confirmDialog(540, '添加授权码', postData, '/static/tpl/authorization_save.html', (vm) => {
			if (vm.modalForm.$valid) {
				let onData = {
					vendorId: postData.vendorId,
					price: postData.price,
					months: '12',
					quantity: postData.quantity
				}
				baseService.saveForm(vm, baseService.api.boardLicenseKey + 'saveBoardLicenseKey', onData, (res) => {
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
			vm.vendors = [];
			vm.terminalExpiredMonthOptions = terminalExpiredMonthOptions;
			baseService.getJson(baseService.api.boardVendor + 'getBoardVendorList', {}, res => {
				vm.vendors = res;
			})
		})
	}
	$scope.exportExcel = function (item) {
		modalService.confirm('导出表格', '确定将当前授权文件?', function (vm) {
			vm.closeThisDialog();
			window.open(baseService.api.boardLicenseKey + 'exportBoardLicenseKeyFile?id=' +
				item.id);
		})
	}
	$scope.changeExceed = function (item) {
		modalService.confirm(item.exceed == 0 ? '开启超限' : '关闭超限', '您确定' + (item.exceed == 0 ? '开启超限' : '关闭超限') + '?',
			(vm) => {
				let me = this;
				baseService.saveForm(vm, baseService.api.boardLicenseKey + 'setBoardLicenseKeyExceed', {
					id: item.id,
					exceed: item.exceed == 1 ? 0 : 1
				}, (res) => {
					if (res) {
						vm.closeThisDialog();
						modalService.alert('操作成功', 'success');
						$scope.callServer($scope.tableState, 0);
					}

				})
			})
	}
	$scope.toDetails = (id) => {
        baseService.goToState('dashboard.authorizationdetail', {
            id: id
        });
    }
	$scope.addQu = (id) => {
		modalService.confirmDialog(540, '增加授权码数量', {}, '/static/tpl/add_quantity.html', (vm) => {
			if (vm.modalForm.$valid) {
				baseService.saveForm(vm, baseService.api.boardLicenseKey + 'increaseQuantity', {
					id: id,
					quantity: parseInt(vm.data.quantity)
				}, (res) => {
					if (res) {
						vm.closeThisDialog();
						modalService.alert('添加成功', 'success');
						$scope.callServer($scope.tableState, 0);
					}

				})
			} else {
				vm.isShowMessage = true;
			}

		})
	}

}

authorizationController.$inject = ['$scope', 'baseService', 'modalService'];

export default angular => {
	return angular.module('authorizationModule', []).controller('authorizationController', authorizationController);
}