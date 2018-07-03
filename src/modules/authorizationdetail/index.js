import style from './style.less';

const authorizationdetailController = ($scope,$stateParams, baseService, modalService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	if ($stateParams.id) {
        $scope.sp.licenseNo = $stateParams.id;
	}
	baseService.postData(baseService.api.boardLicenseKey + 'getBoardLicenseKeyByNo', {
        licenseNo: $scope.sp.licenseNo
    }, (res) => {
        $scope.domainInfo = res;
    })
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.boardLicenseKey + 'getBoardLicenseKeyUsedItemsPage');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	

}

authorizationdetailController.$inject = ['$scope','$stateParams', 'baseService', 'modalService'];

export default angular => {
	return angular.module('authorizationdetailModule', []).controller('authorizationdetailController', authorizationdetailController);
}