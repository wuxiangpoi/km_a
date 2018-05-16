function handlerResponse(response, success, $state) {
    var result = response.data;
    if (result.code === 1) {
        success(result.content);
    } else if (result.code === 2) {
        //todo 跳转登录页面
        //console.log(result.message);
        $state.go("login");
    } else if (result.code === 0) {
        //todo 提示错误消息
        //console.log(result.message);
        layer.msg(result.message);
    }
}

function getParamsUrl(url, data) {
    if (!data) {
        return url;
    }

    var search = object2Search(data);
    var joinChar = url.indexOf('?') >= 0 ? '&' : '?';
    return url + joinChar + search;
}

function object2Search(obj) {
    var arr = [];
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            arr.push(encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]));
        }
    }
    return arr.join("&");
}

var host = require('../../configs/config').host;

module.exports = function (app) {

    app.service('dmbdRest', ['$http', '$state', function ($http, $state) {

        //GET
        this.get = function (url, data, success) {
            var url2 = getParamsUrl(host + url, data);
            return $http.get(url2, {
                withCredentials: true
            }).then(function (response, status, headers, config) {
                handlerResponse(response, success, $state);
            }, function (data, status, headers, config) {
                console.log(data);
            });
        };

        //POST
        this.post = function (url, data, success) {
            return $http({
                method: 'post',
                url: host + url,
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true,
                transformRequest: object2Search
            }).then(function (response, status, headers, config) {
                handlerResponse(response, success, $state);
            }, function (data, status, headers, config) {
                console.log(data);
            });
        };

    }]);

};
