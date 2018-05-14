import echarts from '../libs/chart/echarts.min.js'
export default app => {
    app.factory('chartService', ['baseService', function (baseService) {
        let chartService = {
            initChartSchedule(playList, mLen) {
                let playData = {
                    tooltip: {
                        trigger: 'item'
                    },
                    grid: {
                        top: '0%',
                        left: '0%',
                        right: '2%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        min: '',
                        interval: '',
                        max: '',
                        position: 'top',
                        axisLabel: {
                            formatter: function (value, index) {
                                if (playData.xAxis.interval == intervalDay) {
                                    var date = new Date(value);
                                    var preDate = new Date(value - intervalDay / 5);
                                    var texts = '';
                                    if (playData.xAxis.min == value) {
                                        texts = [(date.getMonth() + 1), date.getDate()].join('/');
                                    } else {
                                        texts = [(preDate.getMonth() + 1), preDate.getDate()].join('/');
                                    }
                                    return ['', texts].join('\n');
                                } else {
                                    var date = new Date(value);
                                    var mon = '';
                                    if (date.getDate() == 1) {
                                        var monTxt = date.getMonth() + 1 + '月';
                                        mon = ['', monTxt].join('\n');
                                        if (date.getMonth() + 1 == 1) {
                                            mon = [(date.getFullYear()) + '年', monTxt].join('\n');
                                        }
                                    }
                                    return mon;
                                }
                                // 格式化成月/日，只在第一个刻度显示年份

                            },
                            fontSize: 12,
                            showMinLabel: true,
                            showMaxLabel: false,
                            color: '#24243e'

                        },
                        axisLine: {
                            lineStyle: {
                                color: '#e2e3e6'
                            },
                        },
                        axisTick: {
                            show: false,
                            length: 8,
                            lineStyle: {
                                color: '#e2e3e6'
                            }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#e2e3e6'
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        inverse: true,
                        data: [],
                        axisTick: {
                            show: true,
                            length: 100,
                            lineStyle: {
                                color: '#e2e3e6'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#e2e3e6'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#e2e3e6',
                                width: 1
                            }
                        },
                        axisLabel: {
                            show: false,
                            formatter: '啊啊啊啊啊啊啊啊'
                        }
                    },
                    series: [{
                        name: '',
                        type: 'bar',
                        stack: '总量',
                        itemStyle: {
                            normal: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0)'
                            },
                            emphasis: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0)'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0);',
                            textStyle: {
                                color: 'rgba(0,0,0,0);'
                            }
                        },
                        data: []
                    }, 
                    {
                        name: '播放时长',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        barWidth: 28,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: '#00b0e2'
                                }, {
                                    offset: 0.5,
                                    color: '#1cbfef'
                                }, {
                                    offset: 1,
                                    color: '#3fd3ff'
                                }])
                            }
                        },
                        tooltip: {
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            },
                            backgroundColor: '#fff',
                            padding: [10, 20, 10, 5],
                            textStyle: {
                                color: '#000'
                            },
                            formatter: function (data) {
                                var playData = data.data.playData;
                                var min_max = baseService.formateDayTxt(playData.startDate) + '-' + baseService.formateDayTxt(playData.endDate);
                                var period = playData.stype == 1 ? playData.startTime + '-' + playData.endTime : '全天';
                                var str = '<span style="color:#000;font-size:16px;">' + data.data.name + '</span><br />'
                                str += '<span style="font-size:13px;">播放日期</span><span style="font-size:12px;color:#9f9f9f;"> ' + min_max + '</span><br />'
                                str += '<span style="font-size:13px;">播放时段</span><span style="font-size:12px;color:#9f9f9f;"> ' + period + '</span><br />'
                                if (playData.stype == 1) {
                                    str += '<span style="font-size:13px;">播放次数</span><span style="font-size:12px;color:#9f9f9f;"> ' + playData.plays + '次</span>'
                                }
                                return str;
                            },
                            extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'

                        },
                        data: []
                    }
                ]
                };
                var interval, dateInterval;
                var intervalDay = 5 * 24 * 60 * 60 * 1000;
                var intervalMon = 30 * 24 * 60 * 60 * 1000;
                var minLen = mLen;
                var chartData = {};
                var dataXlist = [];
                var startDatelist = [];
                var endDatelist = [];
                if (playList.length) {
                    chartData.minDate = baseService.formateDayTime(playList[0].startDate);
                    chartData.maxDate = baseService.formateDayTime(playList[0].endDate);
                }
                if (playList.length > minLen) {
                    minLen = playList.length;
                }
                for (var j = 0; j < minLen; j++) {
                    dataXlist.push({
                        value: ''
                    });
                    startDatelist.push({
                        value: '',
                        name: ''
                    });
                    endDatelist.push({
                        value: '',
                        name: ''
                    });
                }

                for (var i = 0; i < playList.length; i++) {
                    startDatelist[i].value = baseService.formateDayTime(playList[i].startDate);
                    endDatelist[i].name = playList[i].name;
                    endDatelist[i].value = baseService.formateDayTime(playList[i].endDate) - baseService.formateDayTime(playList[i].startDate) + intervalDay / 5;
                    endDatelist[i].playData = playList[i];

                    if (playList[i].stype == 1) {
                        endDatelist[i].itemStyle = {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: '#84fab0'
                                }, {
                                    offset: 1,
                                    color: '#8fd3f4'
                                }])
                            }
                        }
                    }
                    if (baseService.formateDayTime(playList[i].startDate) < chartData.minDate) {
                        chartData.minDate = baseService.formateDayTime(playList[i].startDate);
                    }
                    if (baseService.formateDayTime(playList[i].endDate) > chartData.maxDate) {
                        chartData.maxDate = baseService.formateDayTime(playList[i].endDate);
                    }
                }
                dateInterval = chartData.maxDate - chartData.minDate;
                if (dateInterval > intervalMon) {
                    interval = 24 * 60 * 60 * 1000;
                    chartData.minDate = Date.parse(baseService.getFirstorLastDay(chartData.minDate, true));
                    chartData.maxDate = chartData.minDate + intervalMon * (Math.ceil(dateInterval / intervalMon) + 1);
                } else {
                    interval = intervalDay;
                    chartData.minDate = chartData.minDate;
                    chartData.maxDate = chartData.maxDate + intervalDay;
                }
                playData.xAxis.interval = interval;
                playData.yAxis.data = dataXlist;
                playData.series[0].data = startDatelist;
                playData.series[1].data = endDatelist;
                playData.xAxis.min = chartData.minDate;
                playData.xAxis.max = chartData.maxDate;
                console.log(playData)
                return playData;
            },
           initChartPieTerminal(dataList) {
                var maxValue = '';
                var normalCountList = [];
                var nofflineCountList = [];
                var abnormalCountList = [];
                let terminalOption = {
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
                        formatter: '<span style="color:#fff;">{b}</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#08a9d6;display:inline-block;margin-right:4px;"></span><span style="color:#08a9d6;font-size:12px;">在线终端</span><span style="color:#54e3c5;"> {c0}</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#eee;display:inline-block;margin-right:4px;"></span><span style="color:#adadad;font-size:12px;">离线终端</span><span style="color:#eee;"> {c1}</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#c82f40;display:inline-block;margin-right:4px;"></span><span style="color:#c82f40;font-size:12px;">异常终端</span><span style="color:#f33c45;"> {c2}</span>',
                        extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'
                    },
                    legend: {
                        data: [{
                            name: '在线终端',
                            textStyle: {
                                color: '#08a9d6'
                            }
                        }, {
                            name: '异常终端',
                            textStyle: {
                                color: '#c82f40'
                            }
                        }, {
                            name: '离线终端',
                            textStyle: {
                                color: '#bababa'
                            }
                        }],
                        right: '1%'
                    },
                    grid: {
                        left: '6%',
                        right: '0%',
                        bottom: '0%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        //name: '(月份)',
                        nameRotate: 90,
                        nameTextStyle: {

                        },
                        nameGap: 0,
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
                        data: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
                    },
                    yAxis: [{
                            type: 'value',
                            min: 0,
                            max: maxValue + 20,
                            interval: 20,
                            axisLine: {
                                lineStyle: {
                                    color: '#0d67af'
                                }
                            },
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                color: '#0d67af',
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            splitLine: {
                                show: false,
                                lineStyle: {
                                    color: '#e2e3e6'
                                }
                            },
                            min: 0,
                            axisLine: {
                                lineStyle: {
                                    color: '#e2e3e6'
                                }
                            },
                            max: maxValue + maxValue,
                            axisTick: {
                                show: false
                            },
                            axisLine: {
                                show: false
                            },
                            axisLabel: {
                                show: false
                            }
                        }
                    ],
                    series: [{
                            name: '在线终端',
                            type: 'bar',
                            stack: '总量',
                            areaStyle: {
                                normal: {}
                            },
                            smooth: true,
                            barCategoryGap: '50%',
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
                                            color: '#0d67af' // 0% 处的颜色
                                        }, {
                                            offset: 0.2,
                                            color: '#1083c5' // 0% 处的颜色
                                        }, {
                                            offset: 0.4,
                                            color: '#1096ce' // 0% 处的颜色
                                        }, {
                                            offset: 0.6,
                                            color: '#08a9d6' // 0% 处的颜色
                                        }, {
                                            offset: 0.8,
                                            color: '#06b9de' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#00d1ea' // 100% 处的颜色
                                        }]
                                    }
                                }

                            },
                            data: normalCountList
                        },
                        {
                            name: '离线终端',
                            type: 'bar',
                            stack: '总量',
                            areaStyle: {
                                normal: {}
                            },
                            smooth: true,
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
                                            color: '#a3a4a6' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#dee5e7' // 100% 处的颜色
                                        }]
                                    }
                                }

                            },
                            data: nofflineCountList
                        },
                        {
                            name: '异常终端',
                            type: 'bar',
                            stack: '总量',
                            smooth: true,
                            areaStyle: {
                                normal: {}
                            },
                            areaStyle: {
                                normal: {}
                            },
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
                                            color: '#ad2338' // 0% 处的颜色
                                        }, {
                                            offset: 0.5,
                                            color: '#ad2338' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#e13442' // 100% 处的颜色
                                        }]
                                    }
                                }

                            },
                            data: abnormalCountList
                        },
                        {
                            name: '趋势',
                            type: 'line',
                            smooth: true,
                            yAxisIndex: 1,
                            lineStyle: {
                                normal: {
                                    color: '#0cf5c0',
                                    type: 'dashed'
                                }

                            },
                            data: normalCountList
                        }

                    ]
                }
                let oldMax = 0;
                for (var i = 0; i < dataList.length; i++) {
                    var newMax = dataList[i].normalCount + dataList[i].offlineCount + dataList[i].abnormalCount
                    if (newMax > oldMax) {
                        oldMax = newMax;
                    }
                }
                oldMax = Math.ceil((oldMax + 20) / 10) * 10;
                terminalOption.yAxis[0].max = oldMax;
                terminalOption.yAxis[1].max = oldMax * 2;
                terminalOption.xAxis.data = dataList.map(function (item) {
                    return item.year + '-' + baseService.formateDay(item.month);
                });
                terminalOption.series[0].data = dataList.map(function (item) {
                    return item.normalCount;
                });
                terminalOption.series[3].data = dataList.map(function (item) {
                    return item.normalCount;
                });
                terminalOption.series[1].data = dataList.map(function (item) {
                    return item.offlineCount;
                });
                terminalOption.series[2].data = dataList.map(function (item) {
                    return item.abnormalCount;
                });
                return terminalOption;
            },
            initChartMeter: function (data) {
                let colorArr = ['rgba(12, 237, 189, 0.9)', 'rgba(61, 111, 252, 0.7)', 'rgba(0, 157, 228, 0.8)', 'rgba(12, 141, 250, 0.8)', 'rgba(2, 214, 230, 0.9)'];
                let terminalpieOption = {
					title: {
						text: '{a|新增终端}',
						//subtext: '2018',
						x: 'center',
						y: 'middle',
						color: '#bbbbbb',
						textStyle: {
							rich: {
								a: {
									color: '#00a0e9',
									fontSize: 18,
									backgroundColor: {
										image: '../../img/pie_brg.png'
									},
									height: 110
								}
							}
						},
						//itemGap: -85,
						subtextStyle: {
							color: '#bbb',
							fontSize: 18
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: "{b}<br/>{c} 台",
						backgroundColor: '#0a2439',
						padding: [10, 20, 10, 5],
						textStyle: {
							color: '#fff'
						},
						extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'
					},
					color: colorArr,
					legend: {},
					grid: {
						left: '0%',
						right: '0%',
						bottom: '0%',
						containLabel: true
					},
					calculable: true,
					series: [{
						name: '新增终端',
						type: 'pie',
						radius: [60, 120],
						center: ['50%', '50%'],
						labelLine: {
							normal: {
								length: 8,
								length2: 30,
							}

						},
						label: {
							normal: {
								formatter: '{a|{c}}\n{b|{b}}',
								borderWidth: 0,
								borderRadius: 4,
								padding: [0, -30],
								color: '#00a0e9',
								rich: {
									a: {
										fontSize: 12,
										lineHeight: 20
									},
									b: {
										fontSize: 12,
										lineHeight: 20,
									}

								}
							}
						},
						roseType: 'area',
						data: data
					}]
                };
                terminalpieOption.series[0].data = data;
                return terminalpieOption;
            }
        };
        return chartService;
    }]);
}