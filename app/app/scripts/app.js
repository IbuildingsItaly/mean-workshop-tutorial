angular
    .module('meanApp', [
        'ngCookies',
        'ngResource',
        'ngRoute',
        'google-maps'
    ])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('middleware');

        $routeProvider
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({
                templateUrl: 'views/404.html'
            });
    }])
    .run(['$rootScope', '$location', 'Session', function ($rootScope, $location, Session) {
        $rootScope.$on('$routeChangeStart', function (event) {
            if ($location.path() !== '/login') {
                if (!Session.logged()) {
                    event.preventDefault();
                    $location.path('/login').replace();
                }
            }
        });
    }]);