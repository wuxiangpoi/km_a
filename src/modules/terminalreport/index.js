import './style.less';
import {domainStatusOptions} from '../../filter/options'

const terminalreportController = ($scope, $rootScope, $stateParams, baseService,modalService) => {
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
    $scope.exportExcel = function (item) {
        modalService.confirm('导出表格', '确定将当前企业的所有的终端信息导出excel表格?',function (vm) {
            vm.closeThisDialog();
            window.open(baseService.api.terminal + 'exportTerminal?domain=' +
                item.domainCode);
        })
    }
}

terminalreportController.$inject = ['$scope', '$rootScope', '$stateParams', 'baseService','modalService'];

export default angular => {
    return angular.module('terminalreportModule', []).controller('terminalreportController', terminalreportController);
}