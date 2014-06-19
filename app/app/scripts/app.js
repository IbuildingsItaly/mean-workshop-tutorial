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
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/plan/:planId', {
                templateUrl: 'views/plan.html',
                controller: 'PlanCtrl'
            })
            .when('/plan/:planId/event/:eventId?', {
                templateUrl: 'views/event.html',
                controller: 'EventCtrl'
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
                else Session.setHttpHeaders();
            }
        });
    }]);