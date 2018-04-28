const errPageController = ($scope, $rootScope, baseService, userService) => {
   
        
}

errPageController.$inject = ['$scope', '$rootScope', 'baseService', 'userService'];

export default angular => {
    return angular.module('errPageModule', []).controller('errPageController', errPageController);
}