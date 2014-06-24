angular
    .module('meanApp')
    .controller('PlanCtrl', ['$scope', '$routeParams', 'Plan', 'Event', function ($scope, $routeParams, Plan, Event) {
        $scope.removeEvent = function (eventId) {
            var event = new Event({eventId: eventId, planId: $scope.plan.id});

            event.$delete(function () {
                var idx = 0;
                for (var i = 0; i < $scope.plan.events.length; i++) {
                    if ($scope.plan.events[i].id == eventId) {
                        idx = i;
                        break;
                    }
                }

                $scope.plan.events.splice(idx, 1);
            });
        };

        var plan = new Plan({id: $routeParams.planId});

        plan.$get(function () {
            $scope.plan = plan;
        });
    }]);