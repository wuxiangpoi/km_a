import './style.less';
import {
	materialStatusOptions,
	materialTypeOptions
} from '../../filter/options'
import materialDetailTpl from '../../tpl/material_detail.html'
import programDetailsTpl from '../../tpl/program_details.html'

const checkModelController = ($rootScope, $scope, baseService, $sce, programService, $filter) => {
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
				data.nUrl = baseService.dmbdOSSImageUrlResizeFilter(data.path, 400);
				data.nstatus = $filter('materialStatusTxt')(data.status, 0);
				baseService.confirmDialog(750, '详情', data, materialDetailTpl, function (vm, type) {
					var status = '';
					if (type == 1) {
						status = 1;
					} else {
						status = 5;
					}
					vm.isPosting = true;
					baseService.postData(baseService.api.checkModel + 'check', {
						id: item.id,
						status: status
					}, () => {
						vm.isPosting = false;
						vm.closeThisDialog();
						baseService.alert("操作成功", 'success');
						$scope.initPage();
					})
				}, function (vm) {
					vm.imgPreview = function (item) {
						$rootScope.$broadcast('callImg', item, 1);
					}
				}, detailType)

			});
		} else {
			baseService.getJson(baseService.api.checkModel + 'getCheckInfo', {
				id: item.id
			}, function (data) {
				data.nstatus = $filter('programStatusTxt')(data.status, 0);
				baseService.confirmDialog(750, '详情', data, programDetailsTpl, function (vm,type) {
					var status = '';
					if (type == 1) {
						status = 1;
					} else {
						status = 5;
					}
					vm.isPosting = true;
					baseService.postData(baseService.api.checkModel + 'check', {
						id: item.id,
						status: status
					}, () => {
						vm.isPosting = false;
						vm.closeThisDialog();
						baseService.alert("操作成功", 'success');
						$scope.initPage();
					})
				}, function (vm) {
					programService.getProgramById(data.id, item.domain, function (program) {
						vm.program = program;
					});
				}, detailType)

			});
		}
	}
}

checkModelController.$inject = ['$rootScope', '$scope', 'baseService', '$sce', 'programService', '$filter'];

export default angular => {
	return angular.module('checkModelModule', []).controller('checkModelController', checkModelController);
}