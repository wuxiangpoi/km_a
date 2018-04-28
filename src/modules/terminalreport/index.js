import './style.less';
import {domainStatusOptions} from '../../filter/options'

const terminalreportController = ($scope, $rootScope, $stateParams, baseService) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.domainStatusOptions = domainStatusOptions;
    $scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
        baseService.initTable($scope,tableState,baseService.api.terminal + 'getTerminalDomainReportPageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
}

terminalreportController.$inject = ['$scope', '$rootScope', '$stateParams', 'baseService'];

export default angular => {
    return angular.module('terminalreportModule', []).controller('terminalreportController', terminalreportController);
}