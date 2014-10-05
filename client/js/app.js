'use strict';

// Declare app level module which depends on filters, and services

angular.module('ranter', ['ui.router', 'ranter.controllers', 'ranter.filters', 'ranter.directives', 'ranter.services'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('rootClean', {
                url: '',
                templateUrl: 'partials/login.html',
                controller: 'LoginController'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'partials/register.html',
                controller: 'RegisterController'
            })
            .state('feed', {
                url: '/feed',
                templateUrl: 'partials/feed.html',
                controller: 'FeedController'
            })
            .state('root', {
                url: '/',
                templateUrl: 'partials/login.html',
                controller: 'LoginController'
            })
    });