angular
    .module('meanApp')
    .controller('HomeCtrl', ['$scope', '$location', '$http', 'Session', 'Plan', function ($scope, $location, $http, Session, Plan) {
        $scope.addPlan = function (title) {
            var plan = new Plan({title: title});

            plan.$save(function () {
                $location.path('/plan/' + plan.id);
            });
        };

        $scope.removePlan = function (planId) {
            var plan = new Plan({id: planId});

            plan.$delete(function () {
                delete $scope.plans[planId];
            });
        };

        $http.get('/api/plans')
            .success(function (plans) {
                $scope.plans = plans;
            });
    }]);