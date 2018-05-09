const tempController = ($scope, baseService) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.cmdCodeOptions = cmdCodeOptions;
    $scope.sendStatusOptions = sendStatusOptions;
    $scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
        baseService.initTable($scope, tableState, baseService.api.terminalCommandDomain + 'getTerminalCommandDomainPageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
    
}

tempController.$inject = ['$scope', 'baseService'];

export default angular => {
    return angular.module('terminalcommandModule', []).controller('tempController', tempController);
}