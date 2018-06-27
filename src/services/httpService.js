import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
let transform = function (data) {
    return $.param(data, true);
};
const httpService = ($q, $http) => {
    return {
        getJson(url, params) {
            let deferred = $q.defer();
            axios.get(url + '?tmp=' + (+new Date()), {
                    params: params,
                    paramsSerializer: params => {
                        return transform(params)
                    }
                })
                .then(res => {
                    deferred.resolve(res);
                }).then(response => {
                    deferred.reject(response);
                });

            return deferred.promise;
        },
        postData(url, formData) {

            let deferred = $q.defer();
            axios.post(url, formData, {
                    transformRequest: transform
                })
                .then(res => {
                    deferred.resolve(res);
                })
                .then(error => {
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