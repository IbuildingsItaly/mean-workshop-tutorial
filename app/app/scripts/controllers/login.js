angular
    .module('meanApp')
    .controller('LoginCtrl', ['$scope', '$http', '$location', 'Session', function ($scope, $http, $location, Session) {
        $scope.login = function (username, password) {
            $http.post('/api/login', {username: username, password: password})
                .success(function (data) {
                    Session.authenticate(data.token);
                    $scope.invalid = false;
                    $location.path('/');
                })
                .error(function (err, status) {
                    $scope.invalid = true;
                    $scope.status = status;
                    $scope.error = err;
                });
        };
    }]);