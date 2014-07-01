angular.module('session-api', ['session-service','constants'])
    .factory('SessionAPI', function($q, $http, $rootScope, SessionService, API_URL) {
        return new SessionService(API_URL + '/_queries/public');
    });