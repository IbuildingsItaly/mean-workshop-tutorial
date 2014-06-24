angular
    .module('meanApp')
    .service('Event', ['$resource', function ($resource) {
        return $resource('/api/plans/:planId/events/:eventId', {
            planId: '@planId',
            eventId: '@eventId'
        } , {
            update: {
                method: 'PUT'
            }
        });
    }]);