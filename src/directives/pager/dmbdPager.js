var tplHtml = require('./dmbdPager.html');

module.exports = function (app) {

    //分页组件
    app.directive('dmbdPager', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pageSize: '=',
                pageIndex: '=',
                recordCount: '=',
                onPaging: '&',
                onPaged: '&'
            },
            controller: ['$scope', function ($scope) {
                function getParams(index) {
                    return {
                        $index: index
                    }
                }

                //点击首页
                $scope.goFirstPage = function () {
                    $scope.onPaging(getParams(0));
                };
                //点击末页
                $scope.goLastPage = function () {
                    var pageCount = Math.ceil($scope.recordCount / $scope.pageSize);
                    $scope.onPaging(getParams(pageCount - 1));
                };
                //点击上一页
                $scope.goPrevPage = function () {
                    $scope.onPaging(getParams($scope.pageIndex - 1));
                };
                //点击下一页
                $scope.goNextPage = function () {
                    $scope.onPaging(getParams($scope.pageIndex + 1));
                };
                //点击具体页码
                $scope.goPageIndex = function (pageIndex) {
                    if (pageIndex !== $scope.pageIndex) {
                        $scope.onPaging(getParams(pageIndex));
                    }
                };

                var watcher = $scope.$watchGroup(['recordCount', 'pageIndex'], function (args) {
                    var recordCount = $scope.recordCount = args[0];
                    var pageIndex = args[1];
                    if (recordCount === 0) {//无数据
                        $scope.pageCount = 0;
                        $scope.pageIndex = -1;
                    } else {//有数据
                        $scope.pageCount = Math.ceil(recordCount / $scope.pageSize);
                        $scope.pageIndex = pageIndex;
                    }

                    if (typeof $scope.onPaged === 'function') {
                        $scope.onPaged({
                            recordCount: recordCount,
                            pageCount: $scope.pageCount,
                            pageIndex: $scope.pageIndex
                        });
                    }
                });

                var watcher2 = $scope.$watchGroup(['pageCount', 'pageIndex'], function (args) {
                    var pageCount = args[0];
                    var pageIndex = args[1];
                    var pagerDataList = $scope.pagerDataList = [];
                    if (pageCount < 8) {
                        (function () {
                            for (var i = 0; i < pageCount; i++) {
                                pagerDataList.push({
                                    isLink: true,
                                    linkIndex: i
                                });
                            }
                        })();
                    } else {
                        if (pageIndex < 4) {
                            (function () {
                                for (var i = 0; i < 5; i++) {
                                    pagerDataList.push({
                                        isLink: true,
                                        linkIndex: i
                                    });
                                }
                                pagerDataList.push({
                                    isLink: false,
                                    linkIndex: 0
                                });
                                pagerDataList.push({
                                    isLink: true,
                                    linkIndex: pageCount - 1
                                });
                            })();
                        } else if (pageIndex > pageCount - 5) {
                            (function () {
                                pagerDataList.push({
                                    isLink: true,
                                    linkIndex: 0
                                });
                                pagerDataList.push({
                                    isLink: false,
                                    linkIndex: 0
                                });
                                for (var i = 0; i < 5; i++) {
                                    pagerDataList.push({
                                        isLink: true,
                                        linkIndex: pageCount - 5 + i
                                    });
                                }
                            })();
                        } else {
                            (function () {
                                pagerDataList.push({
                                    isLink: true,
                                    linkIndex: 0
                                });
                                pagerDataList.push({
                                    isLink: false,
                                    linkIndex: 0
                                });
                                for (var i = 0; i < 3; i++) {
                                    pagerDataList.push({
                                        isLink: true,
                                        linkIndex: pageIndex - 1 + i
                                    });
                                }
                                pagerDataList.push({
                                    isLink: false,
                                    linkIndex: 0
                                });
                                pagerDataList.push({
                                    isLink: true,
                                    linkIndex: pageCount - 1
                                });
                            })();
                        }
                    }
                });

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                    watcher2();
                });
            }]
        };
    });

};