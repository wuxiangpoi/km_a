import './style.less';
import roleSaveTpl from '../../tpl/role_save.html';
import permsSetTpl from '../../tpl/perms_set.html'

const roleController = ($scope, baseService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};

	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.admin + 'getAdminRoleInfoPage');
	}
	function getPerms(cb) {
		if ($scope.permList) {
			cb();
		} else {
			baseService.getJson(baseService.api.admin + 'getPermsList', {}, function (data) {
				$scope.permList = data;
				cb();
			})
		}
	}

	function getpermList(fids) {
		var zNodes = [];
		if (fids && fids.length > 0) {
			var fidsArr = fids.split(',')
			for (var i = 0; i < $scope.permList.length; i++) {
				for (var j = 0; j < fidsArr.length; j++) {
					if (fidsArr[j] == $scope.permList[i].id) {
						zNodes.push({
							id: $scope.permList[i].id,
							pId: $scope.permList[i].pid,
							name: $scope.permList[i].name,
						});
					}
				}

			}
		} else {
			for (var i = 0; i < $scope.permList.length; i++) {
				zNodes.push({
					id: $scope.permList[i].id,
					pId: $scope.permList[i].pid,
					name: $scope.permList[i].name,
				});
			}
		}

		return zNodes;
	}
	$scope.checkPerms = function (item) {
		getPerms(function () {
			baseService.confirmDialog(540,'查看权限', {
				set: 1
			}, permsSetTpl, function (ngDialog, vm) {

			}, function (vm) {
				vm.zTreeSetting = {
					zNodes: getpermList(item.fids),
					isSort: false,
					isSet: false,
					isCheck: false,
					selectedNodes: []
				}
			},'<div><div>')
		})

	};
	$scope.save = (item) => {
		let postData = {
			id: item ? item.id : '',
			name: item ? item.name : '',
			fids: item ? item.fids : '',
			remark: item ? item.remark : '',
		}
		baseService.confirmDialog(540,item ? '编辑角色' : '添加角色', postData, roleSaveTpl, (vm) => {
			if (vm.modalForm.$valid) {
				if (vm.fids && vm.fids.length) {
					vm.data.fids = vm.fids.join(',');
					vm.isPosting = false;
					baseService.postData(baseService.api.admin + 'saveAdminRoleInfo', vm.data, function () {
						vm.isPosting = false;
						vm.closeThisDialog();
						baseService.alert(item ? '修改成功' : '添加成功', 'success');
						$scope.callServer($scope.tableState,0);
					})
				} else {
					baseService.alert('请先选择权限', 'warning');
				}
			} else {
				vm.isShowMessage = true;
			}

		}, function (vm) {
			if(!vm.fids){
				vm.fids = item ? item.fids.split(',') : [];
			}
			vm.checkPerms = function () {
				getPerms(function () {
					baseService.confirmDialog(540,'权限设置', {
						set: 2
					}, permsSetTpl, function (vm1) {
						var zTree = $.fn.zTree.getZTreeObj('modalZtree');
						var okNodes = zTree.getCheckedNodes(true);
						var fids = [];
						for (var i = 0; i < okNodes.length; i++) {
							fids.push(okNodes[i].id);
						}
						if (fids.length > 0) {
							vm1.closeThisDialog();
							vm.fids = fids;
						} else {
							baseService.alert('请先选择权限', 'warning', true);
						}
					}, function (vm1) {
						vm1.zTreeSetting = {
							zNodes: getpermList(),
							isSort: false,
							isSet: false,
							isCheck: true,
							selectedNodes: vm.fids
						}
					})
				})
			}
		})
	}

	$scope.del = function (item) {
		baseService.confirm('删除', '您确定删除角色：' + item.name + '?',true,
			function (vm) {
				baseService.postData(baseService.api.admin + 'deleteAdminRoleInfo', {
					id: item.id
				}, function () {
					vm.closeThisDialog();
					baseService.alert("删除成功", 'success');
					$scope.callServer($scope.tableState);
				})
			})
	}
}

roleController.$inject = ['$scope', 'baseService'];

export default angular => {
	return angular.module('roleModule', []).controller('roleController', roleController);
}