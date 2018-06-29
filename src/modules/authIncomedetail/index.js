
const authIncomedetailController = ($scope, baseService, $stateParams,modalService) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.licenseInfo = {};
    if ($stateParams.id) {
        $scope.sp.licenseNo = $stateParams.id;
    }
    $scope.callServer = function (tableState, page) {
        if (baseService.isRealNum(page)) {
            $scope.tableState.pagination.start = page * $scope.sp.length;
        }
        baseService.initTable($scope, tableState, baseService.api.chargeLicenseStat + 'getChargeLicenseStatPageList');
    }
    $scope.initPage = function () {
        $scope.callServer($scope.tableState, 0)
    }
    $scope.exportExcel = function (item) {
        modalService.confirm('导出表格', '确定将当前查询的所有的设备信息导出excel表格?',(vm) => {
            vm.closeThisDialog();
            window.open(baseService.api.chargeLicenseStat + 'exportExcelChageLicenseStatItems?id=' +
                item.id);
        })
    }
    $scope.confirmCharge = function (item) {
        modalService.confirmDialog(540, '确认收费', item, '/static/tpl/confirm_charge.html', function (vm, ngDialog) {
            vm.isShowMessage = false;
            if (vm.modalForm.$valid) {
                baseService.saveForm(vm, baseService.api.chargeLicenseStat + 'confirmChargeLicenseById', {
                    id: item.id,
                    amountReceived: vm.amountReceived,
                    remark: vm.modalForm.remark ? vm.modalForm.remark.$modelValue : ''
                }, (res) => {
                    if (res) {
                        vm.closeThisDialog();
                        modalService.alert("操作成功", 'success');
                        $scope.initPage();
                    }

                })
            } else {
                vm.isShowMessage = true;
            }

        })
    }
    $scope.details = (item) => {
        modalService.confirmDialog(720, '明细', {}, '/static/tpl/authIncome_detail.html', function (vm, ngDialog) {
			
		},(vm) => {
            vm.sp = {
                id: item.id
            };
            vm.tableState = {};
            vm.callServer = function (tableState, page) {
                if (baseService.isRealNum(page)) {
                    vm.tableState.pagination.start = page * vm.sp.length;
                }
                baseService.initTable(vm, tableState, baseService.api.chargeLicenseStat + 'getChargeLicenseStatItemsPageList');
            }
        })
    }
}

authIncomedetailController.$inject = ['$scope', 'baseService', '$stateParams','modalService'];

export default angular => {
    return angular.module('authIncomedetailModule', []).controller('authIncomedetailController', authIncomedetailController);
}