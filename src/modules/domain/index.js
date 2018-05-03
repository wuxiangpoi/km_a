import './style.less';
import {
	domainStatusOptions
} from '../../filter/options.js'
import domainSaveTpl from '../../tpl/domain_save.html';

const domainController = ($scope, baseService, FileUploader) => {
	$scope.callServer = function (tableState) {
		$scope.displayed = [];
		$scope.sp = {};
		$scope.tableState = {};
		$scope.domainStatusOptions = domainStatusOptions;
		var uploader = $scope.uploader = new FileUploader({
			url: 'http://dmbd4.oss-cn-hangzhou.aliyuncs.com',
			autoUpload: false
		});
		baseService.initTable($scope, tableState, baseService.api.domain + 'getDomainPageList');
		$scope.callServer = function (tableState, page) {
			if (baseService.isRealNum(page)) {
				$scope.tableState.pagination.start = page * $scope.sp.length;
			}
			baseService.initTable($scope, tableState, baseService.api.domain + 'getDomainPageList');
		}
		$scope.save = (item) => {
			let materialCheck = ['1', '0'];
			let programCheck = ['1', '2', '0'];
			if (item) {
				if (item.materialCheck == '') {
					materialCheck = ['', ''];
				} else {
					var materialCheckAry = item.materialCheck.split(',');
					for (var i = 0; i < materialCheck.length; i++) {
						if (materialCheckAry.indexOf(materialCheck[i]) == -1) {
							materialCheck[i] = '';
						}

					}
				}
				if (item.programCheck == '') {
					programCheck = ['', '', ''];
				} else {
					var programCheckAry = item.programCheck.split(',');
					for (var i = 0; i < programCheck.length; i++) {
						if (programCheckAry.indexOf((programCheck[i])) == -1) {
							programCheck[i] = '';

						}

					}
				}
			}
			let postData = {
				id: item ? item.id : '',
				phone: item ? item.phone : '',
				name: item ? item.name : '',
				email: item ? item.email : '',
				key: item ? item.key : '',
				price: item ? item.price : '',
				chargeType: 2,
				contractStart: item ? baseService.formateDate(item.contractStart) : '',
				contractEnd: item ? baseService.formateDate(item.contractEnd) : '',
				contact: item ? item.contact : '',
				materialCheck: materialCheck,
				programCheck: programCheck,
				// programCmdCheck: item ? item.programCmdCheck.split(',') : [''],
				ledShow: item ? item.ledShow : 0
			}
			baseService.confirmDialog(item ? '编辑企业' : '添加企业', postData, domainSaveTpl, (vm) => {
				if (vm.modalForm.$valid) {
					let onData = {
						id: postData.id,
						phone: postData.phone,
						name: postData.name,
						email: postData.email,
						key: postData.key,
						price: postData.price,
						chargeType: 2,
						contractStart: postData.contractStart.split('-').join(''),
						contractEnd: postData.contractEnd.split('-').join(''),
						contact: postData.contact,
						materialCheck: materialCheck,
						programCheck: programCheck,
						// programCmdCheck: item ? item.programCmdCheck.split(',') : [''],
						ledShow: item ? item.ledShow : 0
					}
					let url = item ? 'modifyDomain' : 'addDomain';
					onData.key = postData.key.toLowerCase();
					baseService.postData(baseService.api.domain + url,onData,() => {
						vm.$hide();
						baseService.alert(item ? '编辑成功' : '添加成功', 'success');
						$scope.callServer($scope.tableState,0);
					})
				} else {
					vm.isShowMessage = true;
				}

			}, function (vm) {

			})
		}

		$scope.changeEnabled = function (item, index) {
			baseService.confirm(item.status == 0 ? '启用企业' : '冻结企业', '您确定' + (item.status == 0 ? '启用' : '冻结') +
				'企业：' + item.name + '?', true,
				(vm) => {
					let me = this;
					baseService.postData(baseService.api.domain + 'setDomainStatus', {
						did: item.id,
						status: item.status == 1 ? 0 : 1
					}, (res) => {
						baseService.alert('操作成功', 'success');
						vm.$hide();
						$scope.callServer($scope.tableState, 0);
					})
				})
		}
	}
}

domainController.$inject = ['$scope', 'baseService', 'FileUploader'];

export default angular => {
	return angular.module('domainModule', []).controller('domainController', domainController);
}