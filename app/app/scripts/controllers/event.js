angular
    .module('meanApp')
    .controller('EventCtrl', ['$scope', '$location', '$routeParams', 'Event', function ($scope, $location, $routeParams, Event) {
        $scope.event = {
            position: {
                latitude: 44.70137621263722,
                longitude: 10.63525390625
            }
        };
        $scope.planId = $routeParams.planId;

        $scope.map = {
            center: {
                latitude: 44.70137621263722,
                longitude: 10.63525390625
            },
            zoom: 8
        };

        if ($routeParams.eventId) {
            var event = new Event({planId: $routeParams.planId, eventId: $routeParams.eventId});

            event.$get(function () {
                $scope.event = event;
                $scope.map.center.latitude = event.position.latitude;
                $scope.map.center.longitude = event.position.longitude;
            });
        }

        $scope.marker = {
            options: {
                draggable: true
            },
            events: {
                dragend: function (evt) {
                    $scope.event.position = {
                        latitude: evt.position.lat(),
                        longitude: evt.position.lng()
                    };
                }
            }
        };

        $scope.saveEvent = function (event) {
            if (event.eventId) {
                event.$update(function () {
                    $location.path('/plan/' + $scope.planId);
                });
            }
            else {
                event = new Event(event);

                event.planId = $scope.planId;

                event.$save(function () {
                    $location.path('/plan/' + $scope.planId);
                });
            }
        };
    }]);