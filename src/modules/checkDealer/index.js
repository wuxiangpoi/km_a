import './style.less';

const checkDealerController = ($rootScope, $scope, baseService, $sce, programService, $filter, modalService) => {
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
	$scope.materialStatusOptions = [{
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
	$scope.details = function (item, type) {
		modalService.confirm('审核', '您确定' + (type == 1 ? '通过' : '不通过') +
			'商户：' + item.domainName + '?',
			(vm) => {
				var status = '';
				if (type == 1) {
					status = 1;
				} else {
					status = 2;
				}
				baseService.saveForm(vm, baseService.api.merchantInfo + 'checkMerchantInfo', {
					id: item.id,
					status: status
				}, (res) => {
					if (res) {
						vm.closeThisDialog();
						modalService.alert("操作成功", 'success');
						$scope.initPage();
					}

				})

			})
		
	}
}

checkDealerController.$inject = ['$rootScope', '$scope', 'baseService', '$sce', 'programService', '$filter', 'modalService'];

export default angular => {
	return angular.module('checkDealerModule', []).controller('checkDealerController', checkDealerController);
}