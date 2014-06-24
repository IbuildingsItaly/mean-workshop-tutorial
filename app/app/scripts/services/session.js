angular
    .module('meanApp')
    .service('Session', ['$cookieStore', '$http', function ($cookieStore, $http) {
        var me = this;

        me.setHttpHeaders = function () {
            var token = $cookieStore.get('token');

            if (token && token.length > 0 && !$http.defaults.headers.common.Authorization) $http.defaults.headers.common.Authorization = token;
        };

        me.authenticate = function (token) {
            $cookieStore.put('token', token);
            $http.defaults.headers.common.Authorization = token;
        };

        me.logged = function () {
            var token = $cookieStore.get('token');

            return token && token.length > 0;
        };
    }]);