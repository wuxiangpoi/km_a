import style from './style.less';

const authIncomeController = ($scope, baseService, modalService) => {
	$scope.displayed = [];
	$scope.sp = {};
    $scope.tableState = {};
    $scope.domainInfo = {};
	var now = new Date();
    $scope.sp.year = now.getFullYear();
    $scope.sp.month = baseService.formateDay(now.getMonth());
    $scope.dateSel = $scope.sp.year + '-' + $scope.sp.month;
    $scope.$watch('dateSel',(n,o) => {
        if(n != o){
            $scope.sp.year = n.split('-')[0].toString();
            $scope.sp.month = n.split('-')[1].toString();
            $scope.initPage();
        }
        
    })
    $scope.chargeStatusOptions = [{
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
		baseService.initTable($scope, tableState, baseService.api.chargeLicenseStat + 'getChargeLicenseStatPageList',(res)=>{
            $scope.domainInfo = res.extra;
        });
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.toDetails = (id) => {
        baseService.goToState('dashboard.authIncomedetail', {
            id: id
        });
    }

}

authIncomeController.$inject = ['$scope', 'baseService', 'modalService'];

export default angular => {
	return angular.module('authIncomeModule', []).controller('authIncomeController', authIncomeController);
}