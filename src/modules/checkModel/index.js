import './style.less';
import {materialStatusOptions,materialTypeOptions} from '../../filter/options'

const checkModelController = ($scope, baseService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.checkModel + 'getCheckModelList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.materialTypeOptions = materialTypeOptions;
	$scope.materialStatusOptions = materialStatusOptions;

}

checkModelController.$inject = ['$scope', 'baseService'];

export default angular => {
	return angular.module('checkModelModule', []).controller('checkModelController', checkModelController);
}