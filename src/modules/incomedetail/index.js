import './style.less';

const incomedetailController = ($scope, baseService, $stateParams) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.domainInfo = {};
    if ($stateParams.id) {
        $scope.sp.domain = $stateParams.id;
    }
    baseService.postData(baseService.api.apiUrl + '/api/domain/getDomainByKey', {
        key: $scope.sp.domain
    }, (res) => {
        $scope.domainInfo = res;
    })
    $scope.callServer = function (tableState, page) {
        if (baseService.isRealNum(page)) {
            $scope.tableState.pagination.start = page * $scope.sp.length;
        }
        baseService.initTable($scope, tableState, baseService.api.chargeStat + 'getChargeStatPageList');
    }
    $scope.initPage = function () {
        $scope.callServer($scope.tableState, 0)
    }
    $scope.exportExcel = function (item) {
        baseService.confirm('导出表格', '确定将当前查询的所有的设备信息导出excel表格?', (vm) => {
            vm.$hide();
            window.open(baseService.api.chargeStat + 'exportExcelChageStatItems?id=' +
                item.id);
        })
    }
}

incomedetailController.$inject = ['$scope', 'baseService', '$stateParams'];

export default angular => {
    return angular.module('incomedetailModule', []).controller('incomedetailController', incomedetailController);
}