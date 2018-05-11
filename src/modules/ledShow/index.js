import {citiesNo} from '../../services/cityService'

const ledShowController = ($scope,$rootScope, baseService, chartService) => {
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
		baseService.getData(baseService.api.apiUrl + '/api/report/materialReport/' + $scope.sp.year, {}, function (res) {
			var dataList = res;
			var materialCountList = [];
			var monthList = [];
			var videoCountList = [];

			var materialOption = {
				title: {
					text: '2017年素材统计',
					x: 'center',
					textStyle: {
						color: '#00a0e9'
					}
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					},
					backgroundColor: '#0a2439',
					padding: [10, 20, 10, 5],
					textStyle: {
						color: '#000'
					},
					formatter: '<span style="color:#fff;">{b}</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#08a9d6;display:inline-block;margin-right:4px;"></span><span style="color:#00a0e9;font-size:12px;">图片</span><span style="color:#00a0e9;"> {c0}</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#00dee9;display:inline-block;margin-right:4px;"></span><span style="color:#00dee9;font-size:12px;">视频</span><span style="color:#00dee9;"> {c1}</span><br />',
					extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				legend: {
					data: [{
						name: '图片',
						textStyle: {
							color: '#00a0e9'
						}
					}, {
						name: '视频',
						textStyle: {
							color: '#00dee9'
						}
					}],
					right: '1%'
				},
				toolbox: {
					show: false,
					feature: {
						dataView: {
							show: true,
							readOnly: false
						},
						magicType: {
							show: true,
							type: ['line', 'bar']
						},
						restore: {
							show: true
						},
						saveAsImage: {
							show: true
						}
					}
				},
				calculable: true,
				xAxis: [{
					type: 'category',
					axisLine: {
						lineStyle: {
							color: '#0d67af'
						}
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						color: '#0d67af',
						fontSize: 10,
						rotate: 90
					},
					data: monthList
				}],
				yAxis: [{
					type: 'value',
					axisLine: {
						lineStyle: {
							color: '#0d67af'
						}
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						color: '#0d67af',
						fontSize: 10,
						rotate: 90
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: '#0d67af'
						}
					},
				}],
				series: [{
						name: '图片',
						type: 'bar',
						data: materialCountList,
						barCategoryGap: '30%',
						itemStyle: {
							normal: {
								color: {
									type: 'linear',
									x: 0,
									y: 0,
									x2: 1,
									y2: 0,
									colorStops: [{
										offset: 0,
										color: '#0a2439' // 0% 处的颜色
									}, {
										offset: 1,
										color: '#00a0e9' // 100% 处的颜色
									}]
								}
							}

						}
					},
					{
						name: '视频',
						type: 'bar',
						data: videoCountList,
						itemStyle: {
							normal: {
								color: {
									type: 'linear',
									x: 0,
									y: 0,
									x2: 1,
									y2: 0,
									colorStops: [{
										offset: 0,
										color: '#0a2439' // 0% 处的颜色
									}, {
										offset: 1,
										color: '#00dee9' // 100% 处的颜色
									}]
								}
							}

						}
					}
				]
			};

			function setmaterialChart() {
				var monthList = dataList.map(function (item) {
					return item.id.substring(0, 4) + '-' + item.id.substring(4, 6)
				})
				var videoCountList = dataList.map(function (item) {
					return item.videoCount
				})
				var materialCountList = dataList.map(function (item) {
					return item.materialCount
				})

				materialOption.xAxis[0].data = monthList;
				materialOption.series[0].data = materialCountList;
				materialOption.series[1].data = videoCountList;
				$scope.materialOption = materialOption;
			}
			if ($scope.sp.year == year) {
				baseService.getData(baseService.api.apiUrl + '/api/report/materialReport/' + prevYear, {}, function (resPrev) {
					var dataListPrev = [];
					for (var i = 0; i < 12; i++) {
						dataListPrev.push({
							"id": prevYear.toString() + baseService.formateDay(i + 1).toString(),
							"videoCount": 0,
							"materialCount": 0
						});
					}

					for (var i = 0; i < dataListPrev.length; i++) {
						for (var j = 0; j < resPrev.length; j++) {
							if (resPrev[j].id == dataListPrev[i].id) {
								dataListPrev[i].videoCount = resPrev[j].videoCount;
								dataListPrev[i].materialCount = resPrev[j].materialCount;
							}
						}
					}

					dataList = dataListPrev.concat(dataList);
					dataList = dataList.slice(month - 1, 11 + month);
					setmaterialChart();

				})
			} else {
				setmaterialChart();

			}
		})
		baseService.getData(baseService.api.apiUrl + '/api/report/programReport/' + $scope.sp.year, {}, function (res) {
			var dataList = res;
			var monthList = [];
			var totalCountList = [];
			var increaseCountList = [];
			var programOption = {
				title: {
					text: '2017年节目统计',
					x: 'center',
					textStyle: {
						color: '#00a0e9'
					}
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					},
					backgroundColor: '#0a2439',
					padding: [10, 20, 10, 5],
					textStyle: {
						color: '#000'
					},
					formatter: '<span style="color:#fff;">{b}</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#1d62b6;display:inline-block;margin-right:4px;"></span><span style="color:#1d62b6;font-size:12px;">总量</span><span style="color:#1d62b6;"> {c0}</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#0cf5c0;display:inline-block;margin-right:4px;"></span><span style="color:#0cf5c0;font-size:12px;">新增</span><span style="color:#0cf5c0;"> {c1}</span><br />',
					extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'
				},
				legend: {
					data: [{
						name: '总量',
						textStyle: {
							color: '#00a0e9'
						}
					}, {
						name: '新增',
						textStyle: {
							color: '#00dee9'
						}
					}],
					right: '1%'
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					axisTick: {
						show: false
					},
					axisLabel: {
						color: '#0d67af',
						fontSize: 10,
						rotate: 90
					},
					axisLine: {
						lineStyle: {
							color: '#0d67af'
						}
					},
					data: monthList
				}],
				yAxis: [{
					type: 'value',
					axisTick: {
						show: false
					},
					axisLabel: {
						color: '#0d67af',
						fontSize: 10,
						rotate: 90
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: '#0d67af'
						}
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: '#0d67af'
						}
					}
				}],
				series: [{
						name: '新增',
						type: 'line',
						stack: '总量',
						areaStyle: {
							normal: {
								color: {
									type: 'linear',
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: '#0cf5c0' // 0% 处的颜色
									}, {
										offset: 1,
										color: '#0cf5c0' // 100% 处的颜色
									}]
								},
								opacity: 1
							}
						},
						smooth: true,
						itemStyle: {
							normal: {
								color: {
									type: 'linear',
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: '#0cf5c0' // 0% 处的颜色
									}, {
										offset: 1,
										color: '#0cf5c0' // 100% 处的颜色
									}]
								}
							}

						},
						data: totalCountList
					},
					{
						name: '总量',
						type: 'line',
						stack: '总量',
						areaStyle: {
							normal: {
								color: {
									type: 'linear',
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: '#02d4e5' // 0% 处的颜色
									}, {
										offset: 1,
										color: '#1d62b6' // 100% 处的颜色
									}]
								},
								opacity: 1
							}
						},
						smooth: true,
						itemStyle: {
							normal: {
								color: {
									type: 'linear',
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: '#02d4e5' // 0% 处的颜色
									}, {
										offset: 1,
										color: '#1d62b6' // 100% 处的颜色
									}]
								}
							}

						},
						data: increaseCountList
					}
				]
			};

			function setprogramChart() {
				var monthList = dataList.map(function (item) {
					return item.id.substring(0, 4) + '-' + item.id.substring(4, 6)
				})
				var totalCountList = dataList.map(function (item) {
					return item.totalCount
				})
				var increaseCountList = dataList.map(function (item) {
					return item.increaseCount
				})
				programOption.xAxis[0].data = monthList;
				programOption.series[0].data = totalCountList;
				programOption.series[1].data = increaseCountList;
				$scope.programOption = programOption;
			}
			if ($scope.sp.year == year) {
				baseService.getData(baseService.api.apiUrl + '/api/report/programReport/' + prevYear, {}, function (resPrev) {
					var dataListPrev = [];
					for (var i = 0; i < 12; i++) {
						dataListPrev.push({
							"id": prevYear.toString() + baseService.formateDay(i + 1).toString(),
							"totalCount": 0,
							"increaseCount": 0
						});
					}

					for (var i = 0; i < dataListPrev.length; i++) {
						for (var j = 0; j < resPrev.length; j++) {
							if (resPrev[j].id == dataListPrev[i].id) {
								dataListPrev[i].totalCount = resPrev[j].totalCount;
								dataListPrev[i].increaseCount = resPrev[j].increaseCount;
							}
						}
					}

					dataList = dataListPrev.concat(dataList);
					dataList = dataList.slice(month - 1, 11 + month);
					setprogramChart();

				})
			} else {
				setprogramChart();

			}
		})
	}
	$scope.getData();
}

ledShowController.$inject = ['$scope', '$rootScope', 'baseService', 'chartService'];

export default angular => {
	return angular.module('ledShowModule', []).controller('ledShowController', ledShowController);
}