import {citiesNo} from '../../services/cityService'
const homeController = ($scope,$rootScope, baseService, chartService) => {

}

homeController.$inject = ['$scope', '$rootScope', 'baseService', 'chartService'];

export default angular => {
	return angular.module('homeModule', []).controller('homeController', homeController);
}