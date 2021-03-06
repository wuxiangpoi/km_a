import style from './style.less';

import {
	opOptions,
	terminalStatusOptions,
	hasProgramOptions,
	maturityAdjustOptions
} from '../../filter/options';


const terminalController = ($scope, $rootScope, $stateParams, baseService, sentencesService, chartService, programService, modalService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.dateSel = null;
	if ($stateParams.domain) {
		$scope.stateParamsId = $stateParams.domain;
		$scope.sp.domain = $stateParams.domain;
	}
	$scope.tableState = {};
	$scope.ids = [];
	$scope.idsNormal = [];
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
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
	$scope.$watch('dateSel', (n, o) => {
		if (n != o) {
			if(n != null){
				$scope.sp.registMonth = n.split('-').join('');
			}else{
				$scope.sp.registMonth = '';
				$scope.sp.dateSel = null;
			}
			$scope.initPage();
		}

	})
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
		modalService.confirmDialog(720, '播放列表', item, '/static/tpl/terminal_programPlay_list.html', function (ngDialog) {

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
					programService.getProgramById(pitem.pid, $stateParams.id ? $stateParams.id : item.domain, function (program) {

						program.nstatus = '审核通过';
						modalService.confirmDialog(750, '节目预览', program, '/static/tpl/program_details.html', function (vm) {

						}, function (vm) {
							vm.program = program;
						}, 0)
					});

				}


			}

		}, 0)
	}
	$scope.details = function (item) {
		baseService.getJson(baseService.api.terminal + 'getTerminalInfo', {
			tid: item.id
		}, function (data) {
			modalService.confirmDialog(580, '终端详情', data, '/static/tpl/terminal_details.html', function (vm) {}, (vm) => {}, 0)
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
				modalService.confirm('终端操作', "确定对当前选中的设备执行命令：" + switchCommand(command) + "?", function (vm) {
					baseService.saveForm(vm, baseService.api.terminalCommandSend + 'sendCommand', {
							tids: tids,
							command: command
						},
						function (res) {
							if (res) {
								vm.closeThisDialog();
								$scope.sendCommand()
								modalService.alert('操作成功', 'success')
							}

						});
				})
				break;
			case 31:
				modalService.confirmDialog(720, '终端升级', {}, '/static/tpl/versionFile_list.html', function (vm) {
					if (vm.displayed.length == 0) {
						modalService.alert('请至少勾选一个版本文件再进行操作', 'warning');
					} else {
						baseService.saveForm(vm, baseService.api.terminalCommandSend + 'sendCommand', {
							tids: tids,
							version: vm.ids.join(','),
							command: 31
						}, function (res) {
							if (res) {
								vm.closeThisDialog();
								modalService.alert('操作成功', 'success', true);
							}

						})
					}
				}, function (vm) {
					vm.displayed = [];
					vm.sp = {};
					vm.tableState = {};
					vm.ids = [];
					vm.callServer = function (tableState, page) {
						if (baseService.isRealNum(page)) {
							$scope.tableState.pagination.start = page * $scope.sp.length;
						}
						baseService.initTable(vm, tableState, baseService.api.versionFile + 'getVersionFileListPage');
					}
					vm.initPage = () => {
						vm.ids = [];
						vm.callServer(vm.tableState, 0);
					}
					vm.opOptions = opOptions;
					vm.upDate = function (item) {
						modalService.confirm('终端升级', "确定升级该终端：" + item.name + "?", function (vm) {
							baseService.saveForm(vm,baseService.api.terminalCommandSend + 'sendCommand', {
								tids: tids,
								version: item.id,
								command: 31
							}, function (res) {
								if(res){
									vm.closeThisDialog();
									modalService.alert('升级成功', 'success');
								}
								
							})
						})

					}

				})
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
		modalService.confirmDialog(540, '发布通知', data, '/static/tpl/send_notice.html', function (vm, ngDialog) {
			vm.isShowMessage = false;
			vm.startTime = vm.startDate.split('-').join('') + vm.data.start_h * 60 + vm.data.start_m;
			vm.endTime = vm.endDate.split('-').join('') + vm.data.end_h * 60 + vm.data.end_m;
			if (vm.modalForm.$valid && vm.endTime >= vm.startTime) {
				if (sentencesService.checkCon(vm.data.noticeText).sentencesArr.length) {
					modalService.alert('抱歉，您输入的内容包含被禁止的词汇，建议修改相关内容', 'warning');
					vm.data.noticeText = sentencesService.checkCon(vm.data.noticeText).sentencesCon;
				} else {
					vm.data.startDate = vm.startDate;
					vm.data.endDate = vm.endDate;
					baseService.saveForm(vm,baseService.api.terminalCommandSend + 'sendCommandWithNotice', vm.data, function (res) {
						if(res){
							vm.closeThisDialog();
							modalService.alert('发布成功', 'success');
						}
						
					})

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
			vm.$watch('data.startTime', function (o, n) {
				if (o != undefined) {
					vm.data.start_h = o.split(':')[0];
					vm.data.start_m = o.split(':')[1];

				}

			})
			vm.$watch('data.endTime', function (o, n) {
				if (o != undefined) {
					vm.data.end_h = o.split(':')[0];
					vm.data.end_m = o.split(':')[1];
				}

			})
		})
	}
	$scope.migrateTerminals = function () {

		modalService.confirmDialog(540, '终端迁移', {}, '/static/tpl/migrate_terminals.html', function (vm) {

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
				modalService.confirm('迁入终端', '确定迁入企业：' + item.name + '?', function (vm, ngDialog) {
					baseService.saveForm(vm,baseService.api.apiUrl + '/api/terminalMigrate/migrateTerminalsByIds', {
						tids: $scope.ids.join(','),
						domainTo: item.key
					}, function (res) {
						ngDialog.close();
						if(res){
							$scope.initPage();
							modalService.alert('迁入成功', 'success');
						}
						
					})
				})
			}
		}, 0)
	}
	$scope.delTerminals = () => {
		modalService.confirm('删除终端', '确定删除所选终端', (vm) => {
			let me = this;
			baseService.saveForm(vm,baseService.api.apiUrl + '/api/terminalMigrate/deleteTerminalsByIds', {
				tids: $scope.ids.join(',')
			}, (res) => {
				vm.closeThisDialog();

				if(res){
					modalService.alert('删除成功', 'success');
					$scope.initPage();
				}
				
			})
		})
	}
	$scope.terminalcharge = () => {
		modalService.confirmDialog(540, '调整终端日期', {}, '/static/tpl/terminal_charge.html', function (vm, ngDialog) {
			vm.isShowMessage = false;
			if (vm.modalForm.$valid) {
				baseService.saveForm(vm,baseService.api.terminal + 'setTerminalBillingDueDate', {
					tids: $scope.ids.join(','),
					type: vm.type,
					date: vm.date.split('-').join(''),
					reason: vm.reason
				}, function (res) {
					ngDialog.close();
					if(res){
						$scope.initPage();
						modalService.alert('调整成功', 'success');
					}
					
				})

			} else {
				vm.isShowMessage = true;
			}
		}, function (vm) {
			vm.maturityAdjustOptions = maturityAdjustOptions;
		})
	}
}

terminalController.$inject = ['$scope', '$rootScope', '$stateParams', 'baseService', 'sentencesService', 'chartService', 'programService', 'modalService'];

export default angular => {
	return angular.module('terminalModule', []).controller('terminalController', terminalController);
}