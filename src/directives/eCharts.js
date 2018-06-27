export default app => {
    app.directive('eChart', ['$window', ($window) => {
        let controller = ($scope, element, attrs) => {
            var myChart = echarts.init(element[0]);
            window.addEventListener('resize', function () {
                myChart.resize(); //监测图表自适应  
            })

            $scope.$watch('eoption', function (n, o) {
                if (typeof (n) == 'object') {
                    myChart.setOption($scope.eoption);

                };
            });
            $scope.getDom = function () {
                return {
                    'height': element[0].style.height,
                    'width': element[0].offsetWidth
                };
            };
            $scope.$watch($scope.getDom, function () {
                myChart.resize();
            }, true);
        }

        return {
            restrict: 'AE',
            replace: true,
            scope: {
                eoption: '=',
                height: '@',
                width: '@'
            },
            link: controller
        };
    }])
};