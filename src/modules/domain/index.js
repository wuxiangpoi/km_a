import './style.less';
import {cmdCodeOptions,sendStatusOptions} from '../../filter/options.js'
import domainSaveTpl from '../../tpl/domain_save.html';

const domainController = ($scope, baseService, FileUploader) => {
	$scope.callServer = function (tableState) {
		$scope.displayed = [];
		$scope.sp = {};
		$scope.tableState = {};
		$scope.cmdCodeOptions = cmdCodeOptions;
		$scope.sendStatusOptions = sendStatusOptions;
		var uploader = $scope.uploader = new FileUploader({
			url: 'http://dmbd4.oss-cn-hangzhou.aliyuncs.com',
			autoUpload: false
		});
		baseService.initTable($scope, tableState, baseService.api.domain + 'getDomainPageList');
		$scope.callServer = function (tableState,page) {
			if(baseService.isRealNum(page)){
				$scope.tableState.pagination.start = page * $scope.sp.length;
			}
			baseService.initTable($scope, tableState, baseService.api.domain + 'getDomainPageList');
		}
		$scope.save = (item) => {
			baseService.confirmDialog(item ? '编辑企业' : '添加企业', item, domainSaveTpl, (vm) => {
				if (vm.modalForm.$valid) {
					postData.key = postData.key.toLowerCase();
					// domainService.savedomain(item ? 'modifyDomain' : 'addDomain', postData, function () {
					// 	ngDialog.close();
					// 	baseService.alert(item ? '编辑成功' : '添加成功', 'success');
					// 	$scope.callServer($scope.tableState);
					// })
				} else {
					vm.isShowMessage = true;
				}
	
			}, function (vm) {
				
			})
		}
		
		$scope.changeEnabled = function (item, index) {
			baseService.confirm(item.status == 0 ? '启用企业' : '冻结企业', '您确定' + (item.status == 0 ? '启用' : '冻结') +
				'企业：' + item.name + '?',true,
				(vm) => {
					let me = this;
					baseService.postData(baseService.api.domain + 'setDomainStatus',{
						did: item.id,
						status: item.status == 1 ? 0 : 1
					},(res)=>{
						baseService.alert('操作成功','success');
						vm.$hide();
						$scope.callServer($scope.tableState,0);
					})
				})
		}
	}
}

domainController.$inject = ['$scope', 'baseService', 'FileUploader'];

export default angular => {
	return angular.module('domainModule', []).controller('domainController', domainController);
}