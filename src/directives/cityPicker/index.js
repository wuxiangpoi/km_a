import template from './template.html';
import {
    ChineseDistricts
} from '../../services/cityService'

import style from './style.less';

export default app => {
    app.directive('cityPicker', ['baseService', '$window',(baseService, $window) => {
        let link = ($scope, element, attrs) => {
            $scope.provinceName = '';
            $scope.cityName = '';
            $scope.districtName = '';
            $scope.selectedCity = '请选择省/市/区';
            let bodyEl = angular.element($window.document.body);
            $scope.showDistricts = false;
            $scope.currentType = 1;
            $scope.provinces = ChineseDistricts[86];
            $scope.emitData = () => {
                $scope.showDistricts = false;
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.change();
                    })
                }, 0)
            }
            $scope.cancelData = () => {
                $scope.province = '';
                $scope.provinceName = '';
                $scope.city = '';
                $scope.cityName = '';
                $scope.district = '';
                $scope.districtName = '';
                $scope.selectedCity = '请选择省/市/区';
                $scope.choose(1);
                $scope.showDistricts = false;
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.change();
                    })
                }, 0)
            }
            $scope.showSelect = (e) => {
                $scope.showDistricts = !$scope.showDistricts;
            }
            $scope.choose = (type) => {
                $scope.currentType = type;
                switch (type) {
                    case 1:
                        $scope.currentDistricts = ChineseDistricts[86];
                        $scope.currentCities = [];
                        break;
                    case 2:
                        $scope.currentCities = ChineseDistricts[$scope.province];
                        $scope.currentDistricts = [];
                        break;
                    case 3:
                        $scope.currentDistricts = ChineseDistricts[$scope.city];
                        break;
                }
            }
            $scope.chooseDistricts = (c, v) => {
                switch ($scope.currentType) {
                    case 1:
                        $scope.currentType += 1
                        $scope.province = c.code;
                        $scope.provinceName = c.address;
                        $scope.city = '';
                        $scope.cityName = '';
                        $scope.district = '';
                        $scope.districtName = '';
                        $scope.choose($scope.currentType);
                        break;
                    case 2:
                        $scope.city = c;
                        if (ChineseDistricts[c] != 'undefined') {
                            $scope.currentType += 1

                            $scope.choose($scope.currentType);
                        } else {
                            $scope.showDistricts = false;
                            $scope.emitData();
                        }
                        $scope.district = '';
                        $scope.cityName = v;
                        $scope.districtName = '';
                        break;
                    case 3:
                        $scope.district = c;
                        $scope.districtName = v;
                        $scope.showDistricts = false;
                        $scope.emitData();
                        break;
                }
                let cityArr = [];
                if ($scope.provinceName != '') {
                    cityArr.push($scope.provinceName)
                }
                if ($scope.cityName != '') {
                    cityArr.push($scope.cityName)
                }
                if ($scope.districtName != '') {
                    cityArr.push($scope.districtName)
                }
                if (cityArr.length) {
                    $scope.selectedCity = cityArr.join('/');
                } else {
                    $scope.selectedCity = '请选择省/市/区';
                }
            }
            bodyEl.on('click', (e) => {
                if ($(e.target).parents('#cityPicker').hasClass('citySelectWrap')) return;
                $scope.showDistricts = false;
                $scope.$apply();
            })

        }
        return {
            restrict: 'AE',
            replace: true,
            template: template,
            link: link,
            scope: {
                province: '=',
                city: '=',
                district: '=',
                change: '='
            }

        }
    }])
};