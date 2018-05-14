import style from './style.less';
import {
	domainStatusOptions,
	payTypeOptions
} from '../../filter/options.js'
import domainSaveTpl from '../../tpl/domain_save.html';

const domainController = ($scope, baseService, FileUploader) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.domainStatusOptions = domainStatusOptions;
	$scope.uploader = new FileUploader();
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.domain + 'getDomainPageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.save = (item) => {
		let materialCheck = ['1'];
		let programCheck = ['1', '0'];
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
			payType: item ? item.payType.toString() : '',
			chargeType: 2,
			contractStart: item ? baseService.formateDate(item.contractStart) : '',
			contractEnd: item ? baseService.formateDate(item.contractEnd) : '',
			contact: item ? item.contact : '',
			materialCheck: item ? materialCheck : ['1', ''],
			programCheck: item ? programCheck : ['1', '', '0'],
			// programCmdCheck: item ? item.programCmdCheck.split(',') : [''],
			ledShow: item ? item.ledShow : 0
		}
		baseService.confirmDialog(540, item ? '编辑企业' : '添加企业', postData, domainSaveTpl, (vm) => {
			if (vm.modalForm.$valid) {
				let onData = {
					id: postData.id,
					phone: postData.phone,
					name: postData.name,
					email: postData.email,
					key: postData.key,
					price: postData.price,
					payType: postData.payType,
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
				baseService.postData(baseService.api.domain + url, onData, () => {
					vm.closeThisDialog();
					baseService.alert(item ? '编辑成功' : '添加成功', 'success');
					$scope.callServer($scope.tableState, 0);
				})
			} else {
				vm.isShowMessage = true;
			}

		}, function (vm) {
			vm.payTypeOptions = payTypeOptions;

		})
	}
	$scope.saveLogo = function (per) {
		$scope.uploader.filters.push({
			name: 'customFilter',
			fn: function (item /*{File|FileLikeObject}*/ , options) {
				if (this.queue.length >= 1) {
					baseService.alert('每次只能上传一个', 'warning')
					return false;
				}
				var ctype = item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase();
				var type = ',' + ctype + ',';
				var file_type = 'jpg,png';
				if ((',' + file_type + ',').indexOf(type) != -1) {
					return true;
				} else {
					baseService.alert('上传的文件格式平台暂时不支持，目前支持的格式是:' + file_type, 'warning');

					return false;

				}

			}
		});
		$scope.uploader.onAfterAddingFile = function (item) {
			var host = '';
			var accessid = '';
			var policyBase64 = '';
			var signature = '';
			var callbackbody = '';
			var filename = '';
			var key = '';
			//	var	 expire = 0;
			var token = '';
			baseService.postData(baseService.api.domain + 'saveDomainLogo_getOssSignature', {
				id: per.id
			}, function (obj) {
				host = obj['host']
				policyBase64 = obj['policy']
				accessid = obj['accessid']
				signature = obj['signature']
				//	expire =obj['expire']
				callbackbody = obj['callback']
				key = obj['key']
				token = obj['token']
				var new_multipart_params = {
					'key': (key + item.file.name.substr(item.file.name.lastIndexOf('.'))),
					'policy': policyBase64,
					'OSSAccessKeyId': accessid,
					'success_action_status': '200', //让服务端返回200,不然，默认会返回204
					'callback': callbackbody,
					'signature': signature,
					'x:fname': item.file.name,
					'x:type': item.file.type.split('/')[1],
					'x:gid': 1,
					'x:opt': 1,
					'x:token': token
				};
				item.formData = [new_multipart_params];

				item.upload();
			});
		};

		$scope.uploader.onCompleteItem = function (fileItem, response, status, headers) {
			this.queue = [];
		};
		$scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
			this.queue = [];
		};
		$scope.uploader.onCancelItem = function (fileItem, response, status, headers) {
			this.queue = [];
		};
		$scope.uploader.onCompleteAll = function () {
			this.queue = [];
			$scope.initPage();
		};
	}
	$scope.resetEmail = function (item) {
		item.isPosting = true;
		baseService.postData(baseService.api.domain + 'sendRegistrationEmailAndReset', {
			id: item.id
		}, function () {
			item.isPosting = false;
			baseService.alert("发送成功", 'success');
		}, function () {
			item.isPosting = false;
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
					vm.closeThisDialog();
					baseService.alert('操作成功', 'success');
					$scope.callServer($scope.tableState, 0);
				})
			})
	}
}

domainController.$inject = ['$scope', 'baseService', 'FileUploader'];

export default angular => {
	return angular.module('domainModule', []).controller('domainController', domainController);
}