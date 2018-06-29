import './style.less';

const incomeController = ($scope, baseService) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.domainInfo = {};
    var now = new Date();
    $scope.sp.year = now.getFullYear();
    $scope.sp.month = baseService.formateDay(now.getMonth());
    $scope.dateSel = $scope.sp.year + '-' + $scope.sp.month;
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

    $scope.callServer = (tableState, page) => {
        if (baseService.isRealNum(page)) {
            $scope.tableState.pagination.start = page * $scope.sp.length;
        }
        baseService.initTable($scope, tableState, baseService.api.chargeStat + 'getChargeStatPageList',(res)=>{
            $scope.domainInfo = res.extra;
        });
    }
    $scope.initPage = () => {
        $scope.callServer($scope.tableState, 0)
    }
    $scope.toDetails = (id) => {
        baseService.goToState('dashboard.incomedetail', {
            id: id
        });
    }
    $scope.$watch('dateSel',(n,o) => {
        if(n != o){
            $scope.sp.year = n.split('-')[0].toString();
            $scope.sp.month = n.split('-')[1].toString();
            $scope.initPage();
        }
        
    })
}

incomeController.$inject = ['$scope', 'baseService'];

export default angular => {
    return angular.module('incomeModule', []).controller('incomeController', incomeController);
}