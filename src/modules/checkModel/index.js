import './style.less';
import {
	materialStatusOptions,
	materialTypeOptions
} from '../../filter/options'
import scheduleDetailsTpl from '../../tpl/schedule_details.html'
import programDetailsTpl from '../../tpl/program_details.html'

const checkModelController = ($scope, baseService, $sce, programService, $filter) => {
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
	$scope.details = function (item, detailType) {
		if (item.type == 0) {
			baseService.getJson(baseService.api.checkModel + 'getCheckInfo', {
				id: item.id,

			}, function (data) {
				data.play_url = $sce.trustAsResourceUrl(data.path);
				data.detailType = detailType;
				data.nUrl = baseService.dmbdOSSImageUrlResizeFilter(data.path, 400);
				if (data.status == 0) {
					data.nstatus = '待提交审核'
				} else {
					data.nstatus = $rootScope.getCheckStatusAttrOld(data.status, 0);
				}
				baseService.confirmDialog(750, '详情', data, scheduleDetailsTpl, function (type, ngDialog) {
					var status = '';
					if (type == 3) {
						status = 1;
					} else {
						status = 5;
					}
				}, function (vm) {
					vm.imgPreview = function (item) {
						$rootScope.$broadcast('callImg', item, 1);
					}
				})

			});
		} else {
			baseService.getJson(baseService.api.checkModel + 'getCheckInfo', {
				id: item.id
			}, function (data) {
				data.detailType = detailType;
				data.nstatus = $filter('programStatusTxt')(data.status, 0);
				baseService.confirmDialog(750, '详情', data, programDetailsTpl, function (type, ngDialog) {
					var status = '';
					if (type == 3) {
						status = 1;
					} else {
						status = 5;
					}
					// checkModelService.check({
					// 	id: item.id,
					// 	status: status
					// }, function () {
					// 	ngDialog.close();
					// 	baseService.alert("操作成功", 'success');
					// 	$scope.callServer($scope.tableState);
					// })
				}, function (vm) {
					programService.getProgramById(data.id, item.domain, function (program) {
						vm.program = program;
					});
				})

			});
		}
	}
}

checkModelController.$inject = ['$scope', 'baseService', '$sce', 'programService', '$filter'];

export default angular => {
	return angular.module('checkModelModule', []).controller('checkModelController', checkModelController);
}