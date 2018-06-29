import './style.less';

const checkDealerController = ($rootScope, $scope, baseService, $sce, programService, $filter,modalService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.merchantInfo + 'getMerchantInfoPage');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.materialStatusOptions = [
		{
			val: '',
			name: '审核状态'
		},
		{
			val: 0,
			name: '待审核'
		},
		{
			val: 1,
			name: '审核通过'
		},
		{
			val: 2,
			name: '审核不通过'
		}
	];
	$scope.details = function (item, detailType) {
		item.detailType = detailType;
		modalService.confirmDialog(750, detailType == 1?'审核':'详情', item, '/static/tpl/dealer_detail.html', function (vm, ngDialog, type) {
			var status = '';
			if (type == 1) {
				status = 1;
			} else {
				status = 2;
			}
			baseService.saveForm(vm,baseService.api.merchantInfo + 'checkMerchantInfo', {
				id: item.id,
				status: status
			}, (res) => {
				if(res){
					vm.closeThisDialog();
					modalService.alert("操作成功", 'success');
					$scope.initPage();
				}
				
			})
		}, function (vm) {
			vm.imgPreview = function (item) {
				$rootScope.$broadcast('callImg', item, 1);
			}
		})
	}
}

checkDealerController.$inject = ['$rootScope', '$scope', 'baseService', '$sce', 'programService', '$filter','modalService'];

export default angular => {
	return angular.module('checkDealerModule', []).controller('checkDealerController', checkDealerController);
}