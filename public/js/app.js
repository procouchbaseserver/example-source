'use strict';

// Declare app level module which depends on filters, and services

angular.module('ranter', [
  'ngRoute',
  'ranter.controllers',
  'ranter.filters',
  'ranter.services',
  'ranter.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/welcome'
    }).
    when('/wall', {
      templateUrl: 'partials/wall',
      controller: 'WallController'
    }).
<<<<<<< HEAD
    when('/timeline', {
      templateUrl: 'partials/timeline',
      controller: 'WallController'
=======
    when('/register', {
      templateUrl: 'partials/register',
      controller: 'RegisterController'
>>>>>>> e908c7009cd0ecd97aa304dc09b47145194d9a12
    }).
    when('/404', {
      templateUrl: 'partials/404'
    }).
    otherwise({
      redirectTo: '/404'
    });
});