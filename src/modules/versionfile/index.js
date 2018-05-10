import {opOptions} from '../../filter/options';
import verfilesSaveTpl from '../../tpl/upload_list.html'

const versionfileController = ($rootScope,$scope, baseService, FileUploader) => {
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
	$scope.save = () => {
		baseService.confirmDialog(720, '上传版本文件', {}, verfilesSaveTpl, (vm) => {
			if (vm.uploader.queue.length) {
				var filenameArray = [];
				for (var i = 0; i < vm.uploader.queue.length; i++) {
					filenameArray.push(vm.uploader.queue[i].file.desc);
				}
				baseService.postData(baseService.api.material + 'addMaterial_checkUpload', {
					filenameArray: JSON.stringify(filenameArray)
				}, function (res) {
					if (res.length) {
						for (var i = 0; i < res.length; i++) {
							vm.uploader.queue[res[i].index].message = res[i].message;
							vm.uploader.queue[res[i].index].oname = res[i].name;
						}
					} else {
						vm.closeThisDialog();
						$rootScope.$broadcast('callUploader', vm.uploader);
					}
				})


			} else {
				baseService.alert('请先选择文件', 'warning');
			}
		}, (vm) => {
			vm.uploader = new FileUploader();
			vm.uploader.filters.push({
				name: 'customFilter',
				fn: function (item /*{File|FileLikeObject}*/ , options) {

					if (this.queue.length >= 1) {
						baseService.alert('每次只能上传一个','warning')
						return false;
					}

					var ctype = item.name.substr(item.name.lastIndexOf('.') + 1);
					var type = ',' + ctype + ',';
					var file_type = 'apk,zip';
					if ((',' + file_type + ',').indexOf(type) != -1) {
						return true;
					} else {
						baseService.alert('上传的文件格式平台暂时不支持' + ctype + '，目前支持的格式是:' + file_type,'warning');

						return false;

					}

				}
			});
			vm.uploader.onAfterAddingFile = function (fileItem) {
				var fileName = fileItem.file.name.split('.');
				fileName.pop();
				fileItem.file.desc = fileName.join(',');
			};
			vm.uploader.onBeforeUploadItem = function (item) {
				if (!item.formData.length) {
					item.cancel();
				}
				var host = '';
				var accessid = '';
				var policyBase64 = '';
				var signature = '';
				var callbackbody = '';
				var filename = '';
				var key = '';
				//	var	 expire = 0;
				var token = '';
				baseService.postData(baseService.api.versionFile + 'saveVersionFile_getOssSignature', {
					
				}, function (obj) {
					host = obj['host']
					policyBase64 = obj['policy']
					accessid = obj['accessid']
					signature = obj['signature']
					//	expire =obj['expire']
					callbackbody = obj['callback']
					key = obj['key']
					token = obj['token']
					var fname = '';
					if (item.file['Desc']) {
						fname = item.file.Desc;
					}
					var new_multipart_params = {
						'key': (key + item.file.name),
						'policy': policyBase64,
						'OSSAccessKeyId': accessid,
						'success_action_status': '200', //让服务端返回200,不然，默认会返回204
						'callback': callbackbody,
						'signature': signature,
						'x:fname': fname,
						'x:type': '',
						'x:opt': 2,
						'x:token': token
					};
					item.formData = [new_multipart_params];
					item.upload();
				});

			};
			vm.uploader.onCompleteItem = function (fileItem, response, status, headers) {
				if(response){
					if (response.code != 1) {
						fileItem.isSuccess = false;
						fileItem.isError = true;
						fileItem.errorMsg = response.message;
					}
				}
				

			};
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
				vm.closeThisDialog();
				$scope.callServer($scope.tableState, 0);
			})
		})
	}
}

versionfileController.$inject = ['$rootScope','$scope', 'baseService','FileUploader'];

export default angular => {
	return angular.module('versionfileModule', []).controller('versionfileController', versionfileController);
}