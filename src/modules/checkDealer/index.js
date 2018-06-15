import './style.less';
import {
	materialStatusOptions,
	materialTypeOptions
} from '../../filter/options'

const checkDealerController = ($rootScope, $scope, baseService, $sce, programService, $filter,modalService) => {
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
				modalService.confirmDialog(750, '详情', data, '/static/tpl/material_detail.html', function (vm, type) {
					var status = '';
					if (type == 1) {
						status = 1;
					} else {
						status = 5;
					}
					baseService.saveForm(vm,baseService.api.checkModel + 'check', {
						id: item.id,
						status: status
					}, (res) => {
						if(res){
							vm.closeThisDialog();
							modalService.alert("操作成功", 'success');
							$scope.initPage();
						}
						
					})
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
				data.nstatus = $filter('programStatusTxt')(data.status, 0);
				modalService.confirmDialog(750, '详情', data, '/static/tpl/program_details.html', function (vm,type) {
					var status = '';
					if (type == 1) {
						status = 1;
					} else {
						status = 5;
					}
					baseService.saveForm(vm,baseService.api.checkModel + 'check', {
						id: item.id,
						status: status
					}, (res) => {
						if(res){
							vm.closeThisDialog();
							modalService.alert("操作成功", 'success');
							$scope.initPage();
						}
						
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

checkDealerController.$inject = ['$rootScope', '$scope', 'baseService', '$sce', 'programService', '$filter','modalService'];

export default angular => {
	return angular.module('checkDealerModule', []).controller('checkDealerController', checkDealerController);
}