'use strict';

// Declare app level module which depends on filters, and services

angular.module('ranter', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('rootClean', {
                url: '',
                templateUrl: 'partials/login.html'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'partials/register.html'
            })
            .state('feed', {
                url: '/feed',
                templateUrl: 'partials/feed.html'
            })
            .state('root', {
                url: '/',
                templateUrl: 'partials/login.html'
            })
    });