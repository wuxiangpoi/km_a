import './style.less';
import materialSaveNameTpl from '../../tpl/material_saveName.html'
import {
    materialsTypeOptions
} from '../../filter/options.js'

const materialController = ($scope, baseService) => {
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
        baseService.showMaterial(item, 1);
    }
    $scope.saveName = function (item) {
        var modalData = {
            name: item.name
        }
        baseService.confirmDialog(540,'编辑', modalData, materialSaveNameTpl, function (vm) {
            if (vm.modalForm.$valid) {
                vm.isPosting = true;
                baseService.postData(baseService.api.material + 'saveMaterial', {
                    id: item.id,
                    name: vm.data.name
                }, function () {
                    vm.$hide();
                    $scope.initPage();
                    baseService.alert(item ? '修改成功' : '添加成功', 'success');
                }, function (msg) {
                    vm.isPosting = false;
                    baseService.alert(msg, 'warning', true)
                })

            } else {
                vm.isShowMessage = true;
            }
        });
    }
    $scope.submitCheck = (item) => {
        baseService.confirm('提交', '是否提交素材?', true, (vm) => {
            var s = '';
            if (item) {
                s = item.id;
            } else {
                s = $scope.idsNoSubmitCheck.length ? $scope.idsNoSubmitCheck.join(',') : ''
            }
            if (s == '') {
                vm.$hide();
                baseService.alert('提交成功', 'success');
                $scope.ids = [];
                $scope.idsNoSubmitCheck = [];
            } else {
                vm.isPosting = true;
                baseService.postData(baseService.api.material + 'sumbmitCheck', {
                    id: s
                }, () => {
                    vm.isPosting = false;
                    baseService.alert('删除成功', 'success');
                    vm.$hide();
                    $scope.callServer($scope.tableState, 0);
                    $scope.ids = [];
                    $scope.idsNoSubmitCheck = [];
                })
            }

        })
    }
    $scope.del = (item) => {
        baseService.confirm('删除素材', "确定删除素材：" + item.name + "?", true, (vm) => {
            vm.isPosting = true;
            baseService.postData(baseService.api.material + 'delMaterial', {
                id: item.id
            }, () => {
                vm.isPosting = false;
                baseService.alert('删除成功', 'success');
                vm.$hide();
                $scope.callServer($scope.tableState, 0);
            })
        })
    }
}

materialController.$inject = ['$scope', 'baseService'];

export default angular => {
    return angular.module('materialModule', []).controller('materialController', materialController);
}