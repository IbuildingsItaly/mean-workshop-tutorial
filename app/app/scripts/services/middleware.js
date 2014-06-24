angular
    .module('meanApp')
    .service('middleware', function () {
        return {
            request: function (config) {
                if (config.url.search('api') !== -1) config.url = 'http://localhost:12345' + config.url;

                return config;
            }
        }
    });