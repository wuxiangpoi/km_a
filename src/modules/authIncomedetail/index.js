
const authIncomedetailController = ($scope, baseService, $stateParams,modalService) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.licenseInfo = {};
    if ($stateParams.id) {
        $scope.sp.licenseNo = $stateParams.id;
    }
    baseService.getJson(baseService.api.boardLicenseKey + 'getBoardLicenseKeyByNo',{
        licenseNo: $stateParams.id
    },res => {
        $scope.licenseInfo = res;
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
    $scope.exportExcel = function (item) {
        modalService.confirm('导出表格', '确定将当前查询的所有的设备信息导出excel表格?',(vm) => {
            vm.closeThisDialog();
            window.open(baseService.api.chargeStat + 'exportExcelChageStatItems?id=' +
                item.id);
        })
    }
    $scope.confirmCharge = function (item) {
        modalService.confirm('确认收费', '确认收费?', (vm) => {
            baseService.saveForm(vm,baseService.api.chargeStat + 'confirmChargeById', {
                id: item.id
            }, (res) => {
                if(res){
                    vm.closeThisDialog();
                    modalService.alert("操作成功", 'success');
                    $scope.callServer($scope.tableState);
                }
                
            })
        })
    }
    $scope.details = (item) => {
        modalService.confirmDialog(720, '明细', {}, '/static/tpl/authIncome_detail.html', function (vm, ngDialog) {
			
		})
    }
}

authIncomedetailController.$inject = ['$scope', 'baseService', '$stateParams','modalService'];

export default angular => {
    return angular.module('authIncomedetailModule', []).controller('authIncomedetailController', authIncomedetailController);
}