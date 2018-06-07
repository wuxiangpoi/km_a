const httpService = ($q, $http) => {
    return {
        getJson(url, params) {
            let deferred = $q.defer();
            $http({
                method: 'GET',
                url: url + '?tmp=' + (+new Date()),
                params: params,
                dataType: 'json'
            }).then(function (data) {
                deferred.resolve(data);
            }).then(function (response) {
                deferred.reject(response);
            });
    
            return deferred.promise;
        },
        postData(url, formData) {
            let transform = function (data) {
                return $.param(data);
            };
            let deferred = $q.defer();
            $http.post(url, formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    transformRequest: transform
                })
                .then(function (data) {
                    deferred.resolve(data);
                })
                .then(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
    };

}

httpService.$inject = ['$q', '$http'];

export default app => {
    app.factory('httpService', httpService)
}