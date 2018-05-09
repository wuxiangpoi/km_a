import style from './style.less';
import {citiesNo} from '../../services/cityService'

const homeController = ($scope,$rootScope, baseService, chartService) => {
	$scope.sp = {};
	var now = new Date();
	$scope.sp.year = now.getFullYear();
	$scope.sp.month = now.getMonth() + 1;
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var prevYear = year - 1;
	var dataList = [];
	$scope.mapInfo = [];
	
	for (var i = 0; i < 12; i++) {
		dataList.push({
			"month": i + 1,
			"normalCount": 0,
			"offlineCount": 0,
			"abnormalCount": 0
		});
	}
	$scope.formDate = function (n, o, attr) {
		$scope.sp[attr] = n._i.split('-')[0].toString();
		$scope.getData();
	}
	
	$scope.getData = function () {
		baseService.getData(baseService.api.report + 'terminalReport/' + $scope.sp.year, {}, function (res) {
			var dataList = [];
			for (var i = 0; i < 12; i++) {
				dataList.push({
					"year": $scope.sp.year,
					"month": i + 1,
					"normalCount": 0,
					"offlineCount": 0,
					"abnormalCount": 0
				});
			}
			for (var i = 0; i < dataList.length; i++) {
				for (var j = 0; j < res.length; j++) {
					if (res[j].month == dataList[i].month) {
						dataList[i] = res[j];
					}
				}
			}
			if ($scope.sp.year == year) {
				baseService.getData(baseService.api.apiUrl + '/api/report/terminalReport/' + prevYear, {}, function (resPrev) {
					var dataListPrev = [];
					for (var i = 0; i < 12; i++) {
						dataListPrev.push({
							"year": prevYear,
							"month": i + 1,
							"normalCount": 0,
							"offlineCount": 0,
							"abnormalCount": 0
						});
					}
					for (var i = 0; i < dataListPrev.length; i++) {
						for (var j = 0; j < resPrev.length; j++) {
							if (resPrev[j].month == dataListPrev[i].month) {
								dataListPrev[i] = resPrev[j];
							}
						}
					}

					dataList = dataListPrev.concat(dataList);
					dataList = dataList.slice(month - 1, 11 + month);
					$scope.terminalOption = chartService.initChartPieTerminal(dataList);
				})
			} else {
				$scope.terminalOption = chartService.initChartPieTerminal(dataList);

			}


		})
		baseService.getData(baseService.api.report + 'newTerminalPerMonthReport/' + year, {}, function (res) {
			/************************ */
			var data = [];
			if (res.length) {
				for (var i = 0; i < res.length; i++) {
					data.push({
						value: res[i].count,
						year: res[i].year,
						month: res[i].month,
						name: res[i].year + '-' + res[i].month
					})
				}
			}
			if ($scope.sp.year == year) {
				baseService.getData(baseService.api.apiUrl + '/api/report/newTerminalPerMonthReport/' + prevYear, {}, function (resPrev) {
					var dataListPrev = [];

					for (var i = 0; i < 12; i++) {
						dataListPrev.push({
							value: resPrev[i].count,
							year: resPrev[i].year,
							month: resPrev[i].month,
							name: resPrev[i].year + '-' + resPrev[i].month
						});
					}

					data = data.concat(dataListPrev);
					data = data.slice(0, data.length - month + 1);
					$scope.terminalpieOption = chartService.initChartMeter(data);

				})
			} else {
				$scope.terminalpieOption = chartService.initChartMeter(data);

			}
		})
		baseService.getData(baseService.api.report + 'terminalReportAll', {}, function (res) {
			var totalMax = 10000;
			$scope.totalCount = res.totalCount;
			$scope.onlineCount = res.onlineCount;
			$scope.offlineCount = res.offlineCount;
		})
		baseService.getData(baseService.api.report + 'terminalReportByRegion', {}, function (res) {
			//*****************/
	
			var geoCoordMap = {};
			for (var i in citiesNo) {
				geoCoordMap[citiesNo[i].n] = citiesNo[i].p.split('|')[0].split(',');
			}
			var data = [];
	
			for (var i = 0; i < res.length; i++) {
				data.push({
					name: citiesNo[res[i].cityCode].n,
					value: res[i].count
				})
				$scope.mapInfo.push({
					name: citiesNo[res[i].cityCode].n,
					value: res[i].count
				})
			}
			$scope.mapOption = chartService.initChartMap(data);
	
		})
	}
	$scope.getData();
}

homeController.$inject = ['$scope', '$rootScope', 'baseService', 'chartService'];

export default angular => {
	return angular.module('homeModule', []).controller('homeController', homeController);
}