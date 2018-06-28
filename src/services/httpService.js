import axios from 'axios'
axios.defaults.timeout = 6000;
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
axios.interceptors.response.use('timeout', function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) return Promise.reject(err);

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;

    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err);
    }

    // Increase the retry count
    config.__retryCount += 1;

    // Create new promise to handle exponential backoff
    var backoff = new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, config.retryDelay || 1);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function () {
        return axios(config);
    });
});
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
                }).catch(err => {
                    deferred.reject(err);
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
                .catch(error => {
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