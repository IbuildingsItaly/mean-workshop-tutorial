angular
    .module('meanApp')
    .service('Plan', ['$resource', function ($resource) {
        return $resource('/api/plans/:id', {id: '@id'});
    }]);