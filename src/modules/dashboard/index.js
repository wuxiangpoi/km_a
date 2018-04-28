
const dashboardController = ($scope) => {
    
}

dashboardController.$inject = ['$scope', 'baseService'];

export default angular => {
    return angular.module('dashboardModule', []).controller('dashboardController', dashboardController);
}