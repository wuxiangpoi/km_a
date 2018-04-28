import style from './style.less';

const terminalController = ($scope, $rootScope, $stateParams, baseService) => {
    $scope.displayed = [];
    $scope.sp = {};
    if ($stateParams.id) {
        $scope.stateParamsId = $stateParams.id;
        $scope.sp.domain = $stateParams.id;
    }
    $scope.tableState = {};
    $scope.ids = [];
    $scope.idsNormal = [];
    $scope.callServer = function (tableState) {
        baseService.initTable($scope, tableState, baseService.api.terminal + 'getTerminalPageList');
    }
}

terminalController.$inject = ['$scope', '$rootScope', '$stateParams', 'baseService'];

export default angular => {
    return angular.module('terminalModule', []).controller('terminalController', terminalController);
}