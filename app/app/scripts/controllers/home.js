angular
    .module('meanApp')
    .controller('HomeCtrl', ['$scope', '$location', '$http', 'Plan', function ($scope, $location, $http, Plan) {
        $scope.addPlan = function (title) {
            var plan = new Plan({title: title});

            plan.$save(function (plan) {
                if (plan.$resolved) {
                    $location.path('/plan/' + plan.id);
                }
            });
        };

        $scope.removePlan = function (planId) {
            var plan = new Plan({id: planId});

            plan.$delete(function (plan) {
                if (plan.$resolved) {
                    delete $scope.plans[planId];
                }
            });
        };

        $http.get('/api/plans')
            .success(function (plans) {
                $scope.plans = plans;
            });
    }]);