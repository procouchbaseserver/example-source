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
    when('/timeline', {
      templateUrl: 'partials/timeline',
      controller: 'WallController'
    }).
    when('/register', {
      templateUrl: 'partials/register',
      controller: 'RegisterController'
    }).
<<<<<<< HEAD
    when('/about', {
=======
    when('/aboutme', {
>>>>>>> eff2cb4ebc4bb8fcfa3c02d03167a4a138a4ffb7
      templateUrl: 'partials/about',
      controller: 'AboutController'
    }).
    when('/404', {
      templateUrl: 'partials/404'
    }).
    otherwise({
      redirectTo: '/404'
    });
});