import './style.less';
import {
    materialsTypeOptions
} from '../../filter/options.js'

const materialController = ($scope, baseService) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.materialsTypeOptions = materialsTypeOptions;
    $scope.materialOptions = [
        {
            val: '',
            name: '素材状态'
        },
        {
            val: 0,
            name: '待提交'
        },
        {
            val: 1,
            name: '已提交'
        }
    ];
    $scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
        baseService.initTable($scope, tableState, baseService.api.material + 'getMaterialList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
    $scope.showMaterial = function (item) {
        baseService.showMaterial(item, 1);
    }
}

materialController.$inject = ['$scope', 'baseService'];

export default angular => {
    return angular.module('materialModule', []).controller('materialController', materialController);
}