import dictionarySaveTpl from '../../tpl/dictionary_save.html';

const dictionaryController = ($scope, baseService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.getKeys = function () {
		baseService.getJson(baseService.api.dictionary + 'getDictionaryList', {type:0}, function (result) {
			$scope.keys = result;
			$scope.keys.unshift({key:'',name:'请选择主键值'});
		})
	}
	$scope.getKeys();
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.dictionary + 'getDictionaryPageList');
	}
	$scope.initPage = function(){
		$scope.callServer($scope.tableState, 0)
	}
	$scope.save = function () {
		baseService.confirmDialog(540,'添加字典', {}, dictionarySaveTpl, function (vm) {
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
		baseService.confirm('删除', '确定删除字典：' + item.name, (vm) => {
			vm.isPosting = true;
			baseService.postData(baseService.api.dictionary + 'deleteDictionary', {
				did: item.id
			}, () => {
				vm.isPosting = false;
				baseService.alert('删除成功', 'success');
				vm.closeThisDialog();
				$scope.callServer($scope.tableState);
			})
		})
	}
}

dictionaryController.$inject = ['$scope', 'baseService'];

export default angular => {
	return angular.module('dictionaryModule', []).controller('dictionaryController', dictionaryController);
}