import './style.less';

const incomeController = ($scope, baseService) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.chargeStatusOptions = [
        {
            val: '',
            name: '收费状态'
        },
        {
            val: 0,
            name: '待收费'
        },
        {
            val: 1,
            name: '已收费'
        }
    ];

    $scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
        baseService.initTable($scope,tableState,baseService.api.chargeStat + 'getChargeStatPageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
    $scope.toDetails = function(id){
        baseService.goToState('dashboard.incomedetail',{id: id});
    }
}

incomeController.$inject = ['$scope', 'baseService'];

export default angular => {
    return angular.module('incomeModule', []).controller('incomeController', incomeController);
}