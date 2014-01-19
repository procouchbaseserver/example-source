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
    when('/about', {
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