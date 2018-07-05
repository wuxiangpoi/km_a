import style from './style.less';
import {
	domainStatusOptions,
	payTypeOptions,
	domainUseOptions,
	terminalExpiredMonthOptions
} from '../../filter/options.js'

const domainController = ($scope, baseService, FileUploader, modalService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.dateSel = null;
	$scope.tableState = {};
	$scope.domainStatusOptions = domainStatusOptions;
	$scope.domainTypeOptions = [
		{
			val: '',
			name: '账号类型'
		},
		{
			val: 1,
			name: '正式'
		},
		{
			val: 0,
			name: '试用'
		}
	]
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
	$scope.$watch('dateSel', (n, o) => {
		if (n != o) {
			if(n != null){
				$scope.sp.expiredMonth = n.split('-').join('');
			}else{
				$scope.sp.expiredMonth = '';
				$scope.sp.dateSel = null;
			}
			$scope.initPage();
		}

	})
	$scope.save = (item) => {
		let materialCheck = ['1', '0'];
		let programCheck = ['1', '2', '0'];
		let payType = '';
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
			type: item ? item.type.toString() : '0',
			name: item ? item.name : '',
			email: item ? item.email : '',
			key: item ? item.key : '',
			price: item ? item.price : '',
			payType: item ? item.payType.toString() : '',
			chargeType: 2,
			contractStart: item ? baseService.formateDate(item.contractStart) : '',
			contractEnd: item ? baseService.formateDate(item.contractEnd) : '',
			contact: item ? item.contact : '',
			terminalExpiredMonth: item ? item.terminalExpiredMonth.toString() : '12',
			materialCheck: item ? materialCheck : ['1', ''],
			programCheck: item ? programCheck : ['1', '', '0'],
			ledShow: item ? item.ledShow : 0
		}
		modalService.confirmDialog(540, item ? '编辑企业' : '添加企业', postData, '/static/tpl/domain_save.html', (vm) => {
			if (vm.modalForm.$valid && vm.data.contractEnd >= vm.data.contractStart) {
				let onData = {
					id: postData.id,
					phone: postData.phone,
					type: postData.type,
					name: postData.name,
					email: postData.email,
					key: postData.key,
					price: postData.price,
					payType: postData.payType,
					chargeType: 2,
					contractStart: postData.contractStart.split('-').join(''),
					contractEnd: postData.contractEnd.split('-').join(''),
					contact: postData.contact,
					terminalExpiredMonth: postData.terminalExpiredMonth,
					materialCheck: postData.materialCheck.join(','),
					programCheck: postData.programCheck.join(','),
					// programCmdCheck: item ? item.programCmdCheck.split(',') : [''],
					ledShow: postData.ledShow
				}
				let url = item ? 'modifyDomain' : 'addDomain';
				onData.key = postData.key.toLowerCase();
				baseService.saveForm(vm, baseService.api.domain + url, onData, (res) => {
					if (res) {
						vm.closeThisDialog();
						modalService.alert(item ? '编辑成功' : '添加成功', 'success');
						$scope.callServer($scope.tableState, 0);
					}

				})
			} else {
				vm.isShowMessage = true;
			}

		}, function (vm) {
			vm.type = item ? item.type.toString() : '0';
			vm.payTypeOptions = payTypeOptions;
			vm.domainUseOptions = domainUseOptions;
			vm.terminalExpiredMonthOptions = terminalExpiredMonthOptions;
			vm.updateSelection = function ($event, value, chkName, pos) {
				var checkbox = $event.target;
				var checked = checkbox.checked;
				if (checked) {
					if (chkName == 'ledShow') {
						vm.data.ledShow = 1
					} else {
						vm.data[chkName][pos] = value;
					}
				} else {
					if (chkName == 'ledShow') {
						vm.data.ledShow = 0
					} else {
						vm.data[chkName][pos] = '';
					}
				}
			}
		})
	}
	$scope.saveLogo = function (per) {
		$scope.uploader.filters.push({
			name: 'customFilter',
			fn: function (item /*{File|FileLikeObject}*/ , options) {
				if (this.queue.length >= 1) {
					modalService.alert('每次只能上传一个', 'warning')
					return false;
				}
				var ctype = item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase();
				var type = ',' + ctype + ',';
				var file_type = 'jpg,png';
				if ((',' + file_type + ',').indexOf(type) != -1) {
					return true;
				} else {
					modalService.alert('上传的文件格式平台暂时不支持，目前支持的格式是:' + file_type, 'warning');

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
		}, function (res) {
			item.isPosting = false;
			if (res) {
				modalService.alert("发送成功", 'success');
			}
		})
	}
	$scope.changeEnabled = function (item, index) {
		modalService.confirm(item.status == 0 ? '启用企业' : '冻结企业', '您确定' + (item.status == 0 ? '启用' : '冻结') +
			'企业：' + item.name + '?',
			(vm) => {
				let me = this;
				baseService.saveForm(vm, baseService.api.domain + 'setDomainStatus', {
					did: item.id,
					status: item.status == 1 ? 0 : 1
				}, (res) => {
					if (res) {
						vm.closeThisDialog();
						modalService.alert('操作成功', 'success');
						$scope.callServer($scope.tableState, 0);
					}

				})
			})
	}
}

domainController.$inject = ['$scope', 'baseService', 'FileUploader', 'modalService'];

export default angular => {
	return angular.module('domainModule', []).controller('domainController', domainController);
}