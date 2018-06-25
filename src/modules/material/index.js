import './style.less';
import {
    materialsTypeOptions
} from '../../filter/options.js'

const materialController = ($rootScope,$scope, baseService, FileUploader,modalService) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.ids = [];
    $scope.idsNoSubmitCheck = [];
    $scope.materialsTypeOptions = materialsTypeOptions;
    $scope.materialOptions = [{
            val: '',
            name: '素材状态'
        },
        {
            val: 0,
            name: '待提交'
        },
        {
            val: 1,
            name: '已提交'
        }
    ];
    $scope.checkAll = function ($event) {
        $scope.ids = [];
        $scope.idsNoSubmitCheck = [];
        if ($($event.currentTarget).is(':checked')) {
            for (var i = 0; i < $scope.displayed.length; i++) {
                $scope.ids.push($scope.displayed[i].id)
                if ($scope.displayed[i].status == 0) {
                    $scope.idsNoSubmitCheck.push($scope.displayed[i].id)
                }
            }
        } else {
            $scope.ids = [];
            $scope.idsNoSubmitCheck = [];
        }
    }
    $scope.checkThis = function (item, $event) {
        if ($($event.currentTarget).is(':checked')) {
            $scope.ids.push(item.id);
            if (item.status == 0) {
                $scope.idsNoSubmitCheck.push(item.id);
            }
        } else {
            $scope.ids = baseService.removeAry($scope.ids, item.id);
            $scope.idsNoSubmitCheck = baseService.removeAry($scope.idsNoSubmitCheck, item.id);
        }
    }
    $scope.callServer = function (tableState, page) {
        if (baseService.isRealNum(page)) {
            $scope.tableState.pagination.start = page * $scope.sp.length;
        }
        baseService.initTable($scope, tableState, baseService.api.material + 'getMaterialList');
    }
    $scope.initPage = function () {
        $scope.callServer($scope.tableState, 0)
    }
    $scope.showMaterial = function (item) {
        baseService.showMaterial(item, 0);
    }
    $scope.save = function () {
        modalService.confirmDialog(720, '添加素材', {
            showTip: true
        }, '/static/tpl/upload_list.html', function (vm) {
            vm.beforeUpload = (item) => {
                var imgfile_type = $rootScope.getRootDicNameStrs('image_format');
                var videofile_type = $rootScope.getRootDicNameStrs('video_format');
                var host = '';
                var accessid = '';
                var policyBase64 = '';
                var signature = '';
                var callbackbody = '';
                var filename = '';
                var key = '';
                //	var	 expire = 0;
                var token = '';
                var ctype = item.file.name.substr(item.file.name.lastIndexOf('.') + 1).toLowerCase();
                var type = ',' + ctype + ',';
                var xType = '';
                if ((',' + imgfile_type.toLowerCase() + ',').indexOf(type) != -1) {
                    xType = 0;
                } else if ((',' + videofile_type.toLowerCase() + ',').indexOf(type) != -1) {
                    xType = 1;
                } else {
                    xType = 2;
                }
                baseService.postData(baseService.api.material + 'addMaterial_getOssSignature', {
                    type: xType
                }, function (obj) {
                    host = obj['host']
                    policyBase64 = obj['policy']
                    accessid = obj['accessid']
                    signature = obj['signature']
                    //	expire =obj['expire']
                    callbackbody = obj['callback']
                    key = obj['key']
                    token = obj['token']
                    //	$scope.uploader.url=host;
                    var filename = item.file.name;
                    if (item.file['desc']) {
                        filename = item.file.desc;
                    }
                    var new_multipart_params = {
                        'key': (key + item.file.name.substr(item.file.name.lastIndexOf('.'))),
                        'policy': policyBase64,
                        'OSSAccessKeyId': accessid,
                        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                        'callback': callbackbody,
                        'signature': signature,
                        'x:fname': filename,
                        'x:type': xType,
                        'x:gid': item.oid,
                        'x:opt': 0,
                        'x:token': token
                    };
                    item.formData = [new_multipart_params]; //上传前，添加描述文本
                    item.upload();
                });
            }
            if (vm.uploader.queue.length) {
                var filenameArray = [];
                for (var i = 0; i < vm.uploader.queue.length; i++) {
                    filenameArray.push(vm.uploader.queue[i].file.desc);
                }
                baseService.saveForm(vm,baseService.api.material + 'addMaterial_checkUpload', {
                    filenameArray: JSON.stringify(filenameArray)
                }, function (res) {
                    if(res){
                        if (res.length) {
                            for (var i = 0; i < res.length; i++) {
                                vm.uploader.queue[res[i].index].message = res[i].message;
                                vm.uploader.queue[res[i].index].oname = res[i].name;
                            }
                        } else {
                            vm.closeThisDialog();
                            $rootScope.$broadcast('callUploader', vm.uploader,vm.beforeUpload);
                        }
                    }
                    
                })


            } else {
                modalService.alert('请先选择文件', 'warning');
            }
        }, function (vm) {

            vm.sp = {};

            var uploader = vm.uploader = new FileUploader();

            // FILTERS

            vm.uploader.filters.push({
                name: 'customFilter',
                fn: function fn(item /*{File|FileLikeObject}*/ , options) {

                    if (this.queue.length >= 10) {
                        modalService.alert('上传队列达到最大值10个', 'warining', true);
                        return false;
                    }

                    var ctype = item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase();
                    var type = ',' + ctype + ',';
                    //var file_type = vm.data.type == '0' ? $rootScope.getRootDicNameStrs('image_format') : $rootScope.getRootDicNameStrs('video_format');
                    var imgfile_type = vm.imgfile_type = $rootScope.getRootDicNameStrs('image_format');
                    var videofile_type = vm.videofile_type = $rootScope.getRootDicNameStrs('video_format');
                    var audiofile_type = ',mp3,';
                    if ((',' + imgfile_type.toLowerCase() + ',').indexOf(type) != -1 || (',' + videofile_type.toLowerCase() + ',').indexOf(type) != -1 || (',' + audiofile_type.toLowerCase() + ',').indexOf(type) != -1) {
                        if ((',' + imgfile_type.toLowerCase() + ',').indexOf(type) != -1) {
                            if (item.size > 10 * 1024 * 1024) {
                                modalService.alert('不得上传大于10Mb的图片', 'warning');
                            } else {
                                return true;
                            }
                        } else if ((',' + audiofile_type.toLowerCase() + ',').indexOf(type) != -1) {
                            if (item.size > 10 * 1024 * 1024) {
                                modalService.alert('不得上传大于10Mb的音乐', 'warning');
                            } else {
                                return true;
                            }
                        } else {
                            if (item.size > 500 * 1024 * 1024) {
                                modalService.alert('不得上传大于500Mb的视频', 'warning');
                            } else {
                                return true;
                            }
                        }
                    } else {
                        modalService.alert('暂不支持该格式文件','warning');
                        return false;
                    }
                }
            });

            vm.uploader.onAfterAddingFile = function (fileItem) {
                var fileName = fileItem.file.name.split('.');
                fileName.pop();
                fileItem.file.desc = fileName.join(',');
            };

           
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                if(response){
                    if (response.code != 1) {
                        fileItem.isSuccess = false;
                        fileItem.isError = true;
                        fileItem.errorMsg = response.message;
                    }else{
                        $scope.initPage();
                    }
                }
                

            };
        });
    };
    $scope.saveName = function (item) {
        var modalData = {
            name: item.name
        }
        modalService.confirmDialog(540,'编辑', modalData, '/static/tpl/material_saveName.html', function (vm) {
            if (vm.modalForm.$valid) {
                vm.isPosting = true;
                baseService.saveForm(vm,baseService.api.material + 'saveMaterial', {
                    id: item.id,
                    name: vm.data.name
                }, function (res) {
                    if(res){
                        vm.closeThisDialog();
                        $scope.initPage();
                        modalService.alert(item ? '修改成功' : '添加成功', 'success');
                    }
                    
                })

            } else {
                vm.isShowMessage = true;
            }
        });
    }
    $scope.submitCheck = (item) => {
        modalService.confirm('提交', '是否提交素材?', (vm,ngDialog) => {
            var s = '';
            if (item) {
                s = item.id;
            } else {
                s = $scope.idsNoSubmitCheck.length ? $scope.idsNoSubmitCheck.join(',') : ''
            }
            if (s == '') {
                ngDialog.close();
                modalService.alert('提交成功', 'success');
                $scope.ids = [];
                $scope.idsNoSubmitCheck = [];
            } else {
                vm.isPosting = true;
                baseService.postData(baseService.api.material + 'sumbmitCheck', {
                    id: s
                }, () => {
                    vm.isPosting = false;
                    modalService.alert('提交成功', 'success');
                    ngDialog.close();
                    $scope.callServer($scope.tableState, 0);
                    $scope.ids = [];
                    $scope.idsNoSubmitCheck = [];
                })
            }

        })
    }
    $scope.del = (item) => {
        modalService.confirm('删除素材', "确定删除素材：" + item.name + "?",(vm) => {
            vm.isPosting = true;
            baseService.postData(baseService.api.material + 'delMaterial', {
                id: item.id
            }, () => {
                vm.isPosting = false;
                modalService.alert('删除成功', 'success');
                vm.closeThisDialog();
                $scope.callServer($scope.tableState, 0);
            })
        })
    }
}

materialController.$inject = ['$rootScope','$scope', 'baseService', 'FileUploader','modalService'];

export default angular => {
    return angular.module('materialModule', []).controller('materialController', materialController);
}