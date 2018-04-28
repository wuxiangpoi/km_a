import './style.less';

const terminalmigrateController = ($scope, baseService) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
        baseService.initTable($scope, tableState, baseService.api.apiUrl + '/api/terminalMigrate/getTerminalMigratePageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
}

terminalmigrateController.$inject = ['$scope', 'baseService'];

export default angular => {
    return angular.module('terminalmigrateModule', []).controller('terminalmigrateController', terminalmigrateController);
}