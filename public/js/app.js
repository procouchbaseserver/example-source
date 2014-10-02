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
      templateUrl: 'partials/login.html',
      controller: 'LoginController'
    }).
    when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'RegisterController'
    }).
    when('/feed', {
      templateUrl: 'partials/feed.html',
      controller: 'FeedController'
    }).
    when('/404', {
      templateUrl: 'partials/404'
    }).
    otherwise({
      redirectTo: '/404'
    });
});