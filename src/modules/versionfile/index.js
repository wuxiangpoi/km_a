import {opOptions} from '../../filter/options';

const versionfileController = ($scope, baseService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope,tableState,baseService.api.versionFile + 'getVersionFileListPage');
	}
	$scope.initPage = function(){
		$scope.callServer($scope.tableState, 0)
	}
	$scope.opOptions = opOptions;
	$scope.save = function () {
		baseService.confirmDialog('添加字典', {}, dictionarySaveTpl, function (vm) {
			let postData = {
				key: vm.data.key,
				name: vm.name,
				type: vm.type
			}
			if (vm.type == 1) {
				postData.value = postData.data.value;
			}
			if (vm.dictionaryForm.$valid) {
				vm.isPosting = false;
				baseService.getJson(baseService.api.dictionary + 'addDictionary', postData, function () {
					vm.isPosting = false;
					baseService.alert('添加成功', 'success');
					vm.$hide();
					$scope.callServer($scope.tableState, 0);
				})
			} else {
				vm.isShowMessage = true;
			}

		}, function (vm) {
			vm.name = '';
			vm.data.key = '';
			if ($scope.sp.key && $scope.sp.key != '') {
				vm.type = 1;
				vm.data.value = '';
				vm.data.key = $scope.sp.key;
			} else {
				vm.type = 0;
			}
		})
	}
	$scope.del = (item) => {
		baseService.confirm('删除', '确定删除版本文件：' + item.name,true, (vm) => {
			vm.isPosting = true;
			baseService.postData(baseService.api.dictionary + 'deleteDictionary', {
				did: item.id
			}, () => {
				vm.isPosting = false;
				baseService.alert('删除成功', 'success');
				vm.$hide();
				$scope.callServer($scope.tableState, 0);
			})
		})
	}
}

versionfileController.$inject = ['$scope', 'baseService'];

export default angular => {
	return angular.module('versionfileModule', []).controller('versionfileController', versionfileController);
}