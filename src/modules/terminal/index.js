import style from './style.less';
import terminalProgramPlayListTpl from '../../tpl/terminal_programPlay_list.html'
import {opOptions,terminalStatusOptions,hasProgramOptions} from '../../filter/options';


const terminalController = ($scope, $rootScope, $stateParams, baseService) => {
    $scope.displayed = [];
    $scope.sp = {};
    if ($stateParams.domain) {
        $scope.stateParamsId = $stateParams.domain;
        $scope.sp.domain = $stateParams.domain;
    }
    $scope.tableState = {};
    $scope.ids = [];
    $scope.idsNormal = [];
    $scope.callServer = function (tableState) {
        baseService.initTable($scope, tableState, baseService.api.terminal + 'getTerminalPageList');
    }
    $scope.opOptions = opOptions;
    $scope.terminalStatusOptions = terminalStatusOptions;
    $scope.hasProgramOptions = hasProgramOptions;
    $scope.showPrograms = (item) => {
        baseService.confirmDialog(720, '播放列表', item, terminalProgramPlayListTpl, function (ngDialog) {

        }, function (vm) {
            vm.displayed = [];
            vm.sp = {};
            vm.sp.tid = item.id;
            vm.sp.domain = $stateParams.id ? $stateParams.id : item.domain;
            vm.tableState = {};
            vm.callServer = function (tableState) {
                baseService.initTable(vm, tableState, baseService.api.terminal + 'getProgramPlayByTid');
            }
            vm.showProgramOrSchedule = function (pitem) {
                pitem.domain = item.domain;
                if (pitem.stype == 1) {
                    baseService.showSchedule(pitem, 2, chartService);
                } else {
                    item.detailType = 0;
                    item.status = 1;
                    baseService.confirmDialog(750, '节目预览', item, terminalProgramPlayListTpl, function (ngDialog, vm) {

                    }, function (vm) {
                        programService.getProgramById(pitem.pid, $stateParams.id ? $stateParams.id : item.domain, function (program) {
                            vm.program = program;
                        });
                    })
                }


            }

        })
    }
}

terminalController.$inject = ['$scope', '$rootScope', '$stateParams', 'baseService'];

export default angular => {
    return angular.module('terminalModule', []).controller('terminalController', terminalController);
}