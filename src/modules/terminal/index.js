import style from './style.less';
import terminalProgramPlayListTpl from '../../tpl/terminal_programPlay_list.html'
import terminalDetailsTpl from '../../tpl/terminal_details.html'
import versionFileListTpl from '../../tpl/versionFile_list.html'
import sendNoticeTpl from '../../tpl/send_notice.html'
import migrateTerminalsTpl from '../../tpl/migrate_terminals.html'
import {
	opOptions,
	terminalStatusOptions,
	hasProgramOptions
} from '../../filter/options';


const terminalController = ($scope, $rootScope, $stateParams, baseService,sentencesService) => {
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
	$scope.initPage = function () {
		$scope.ids = [];
		$scope.idsNormal = [];
		$scope.callServer($scope.tableState, 0)
	}
	$scope.opOptions = opOptions;
	$scope.terminalStatusOptions = terminalStatusOptions;
	$scope.hasProgramOptions = hasProgramOptions;
	$scope.checkAll = function ($event) {
		$scope.ids = [];
		$scope.idsNormal = [];
		if ($($event.currentTarget).is(':checked')) {
			for (var i = 0; i < $scope.displayed.length; i++) {
				$scope.ids.push($scope.displayed[i].id)
				if ($scope.displayed[i].status == 1) {
					$scope.idsNormal.push($scope.displayed[i].id)
				}
			}
		} else {
			$scope.ids = [];
			$scope.idsNormal = [];
		}
	}
	$scope.checkThis = function (item, $event) {
		if ($($event.currentTarget).is(':checked')) {
			$scope.ids.push(item.id);
			if (item.status == 1) {
				$scope.idsNormal.push(item.id);
			}
		} else {
			$scope.ids = baseService.removeAry($scope.ids, item.id);
			$scope.idsNormal = baseService.removeAry($scope.idsNormal, item.id);
		}
	}
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
	$scope.details = function (item) {
		baseService.getJson(baseService.api.terminal + 'getTerminalInfo', {
			tid: item.id
		}, function (data) {
			baseService.confirmDialog(580, '终端详情', data, terminalDetailsTpl, function (vm) {}, (vm) => {}, '<div></div>')
		});

	}
	$scope.sendCommand = function (command) {
		var tids = $scope.ids.join(',');

		function switchCommand(commandTxt) {
			switch (commandTxt) {
				case 7:
					return '终端截屏'
					break;
				case 8:
					return '获取终端信息'
					break;
				case 9:
					return '终端初始化'
					break;
				case 10:
					return '获取运行日志'
					break;
			}
		}
		switch (command) {
			case 7:
			case 8:
			case 9:
			case 10:
				baseService.confirm('终端操作', "确定对当前选中的设备执行命令：" + switchCommand(command) + "?", true, function (vm) {
					baseService.postData(baseService.api.terminalCommandSend + 'sendCommand', {
							tids: tids,
							command: command
						},
						function (data) {
							vm.closeThisDialog();
							$scope.sendCommand()
							baseService.alert('操作成功', 'success')
						});
				})
				break;
			case 31:
				baseService.confirmDialog(720, '终端升级', {}, versionFileListTpl, function (vm) {
					if (vm.displayed.length == 0) {
						baseService.alert('请至少勾选一个版本文件再进行操作', 'warning');
					} else {
						baseService.postData(baseService.api.terminalCommandSend + 'sendCommand', {
							tids: tids,
							version: vm.ids.join(','),
							command: 31
						}, function () {
							vm.closeThisDialog();
							baseService.alert('操作成功', 'success', true);
						})
					}
				}, function (vm) {
					vm.displayed = [];
					vm.sp = {};
					vm.tableState = {};
					vm.ids = [];
					vm.callServer = function (tableState,page) {
						if (baseService.isRealNum(page)) {
							$scope.tableState.pagination.start = page * $scope.sp.length;
						}
						baseService.initTable(vm, tableState, baseService.api.versionFile + 'getVersionFileListPage');
					}
					vm.initPage = () => {
						vm.ids = [];
						vm.callServer(vm.tableState,0);
					}
					vm.opOptions = opOptions;
					vm.upDate = function (item) {
						baseService.confirm('终端升级', "确定升级该终端：" + item.name + "?", function (vm) {
							baseService.postData(baseService.api.terminalCommandSend + 'sendCommand', {
								tids: tids,
								version: item.id,
								command: 31
							}, function () {
								vm.closeThisDialog();
								baseService.alert('升级成功', 'success', true);
							})
						})

					}
					
				},'<div></div>')
				break;
		}
	}
	$scope.sendNotice = function () {
		var data = {
			tids: $scope.ids.join(','),
			command: 23,
			start_h: '',
			start_m: '',
			end_h: '',
			end_m: '',
			noticeText: '',
		}
		baseService.confirmDialog(540, '发布通知', data, sendNoticeTpl, function (vm) {
			vm.isShowMessage = false;
			if (vm.noticeForm.$valid) {
				if (sentencesService.checkCon(vm.data.noticeText).sentencesArr.length) {
					baseService.alert('抱歉，您输入的内容包含被禁止的词汇，建议修改相关内容', 'warning');
					vm.data.noticeText = sentencesService.checkCon(vm.data.noticeText).sentencesCon;
				} else {
					var startTime = vm.startDate.toString() + vm.data.start_h.toString() + (vm.data.start_m / 60).toString();
					var endTime = vm.endDate.toString() + vm.data.end_h.toString() + (vm.data.end_m / 60).toString();
					if (parseInt(startTime) > parseInt(endTime)) {
						baseService.alert('结束时间不得小于开始时间', 'warning');
					} else {
						vm.data.startDate = $rootScope.formateDate(vm.startDate);
						vm.data.endDate = $rootScope.formateDate(vm.endDate);
						baseService.postData(baseService.api.terminalCommandSend + 'sendCommandWithNotice', vm.data, function (data) {
							ngDialog.close();
							baseService.alert('发布成功', 'success');
						})
					}
				}


			} else {
				vm.isShowMessage = true;
			}
		}, function (vm) {
			var day = new Date();
			vm.today = day.getFullYear() + '-' + baseService.formateDay(day.getMonth() + 1) + baseService.formateDay(day.getDate());
			vm.data.startTime = "00:00";
			vm.data.endTime = "00:00";
			vm.data.start_h = '00';
			vm.data.start_m = '00';
			vm.data.end_h = '00';
			vm.data.end_m = '00';
			vm.$watch('startTime',function(o,n){
				if(o != undefined){
					vm.data.start_h = o.split(':')[0];
					vm.data.start_m = o.split(':')[1];
				}
				
			})
			vm.$watch('endTime',function(o,n){
				if(o != undefined){
					vm.data.end_h = o.split(':')[0];
					vm.data.end_m = o.split(':')[1];
				}
				
			})
		})
	}
	$scope.migrateTerminals = function () {

		baseService.confirmDialog(540, '终端迁移', {}, migrateTerminalsTpl, function (vm) {

		}, function (vm) {
			vm.displayed = [];
			vm.sp = {};
			vm.sp.status = 1;
			vm.tableState = {};
			vm.callServer = function (tableState) {
				baseService.initTable(vm, tableState, baseService.api.domain + 'getDomainPageList');
			}
			vm.initPage = function () {
				vm.tableState.pagination.start = 0;
				vm.callServer(vm.tableState);
			}
			vm.migrate = function (item) {
				baseService.confirm('迁入终端', '确定迁入企业：' + item.name + '?', function (vm) {
					baseService.postData(baseService.api.apiUrl + '/api/terminalMigrate/migrateTerminalsByIds', {
						tids: $scope.ids.join(','),
						domainTo: item.key
					}, function () {
						vm.closeThisDialog();
						baseService.alert('迁入成功', 'success');
					})
				})
			}
		},'<div></div>')
	}
}

terminalController.$inject = ['$scope', '$rootScope', '$stateParams', 'baseService','sentencesService'];

export default angular => {
	return angular.module('terminalModule', []).controller('terminalController', terminalController);
}