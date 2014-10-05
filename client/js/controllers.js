'use strict';

/* Controllers */

angular.module('ranter.controllers', [])
    .controller('AppCtrl', function ($scope, $http) {
        //TODO:Yaniv: WTF is this http for? and what is the purpose of this controller?
        $http({
            method: 'GET',
            url: '/api/name'
        }).
            success(function (data, status, headers, config) {
                $scope.name = data.name;

            }).
            error(function (data, status, headers, config) {
                $scope.name = 'Error!'
            });

    })
    .controller('RegisterController', function ($scope, $rootScope, $state, registerService) {
        var model = {
            username: null,
            description: null,
            image: null,
            password: null,
            email: null
        };
        $scope.model = model;

        $scope.events = {
            register: function () {
                registerService.register(model.username, model.description, model.image, model.password)
                    .success(function (result) {
                        $rootScope.rootModel = {};
                        $rootScope.rootModel.registerData = result;

                        $state.go('feed');
                    })
                    .error(function (data, status) {

                    });
            }}
    })
    .controller('LoginController', function ($scope, $rootScope, $http, $state) {
        $rootScope.user = {
            username: '',
            passwd: '',
            isLoggedIn: false
        };
        $scope.submit = function () {
            $http.post('/api/login', $rootScope.user).success(function (data) {
                $rootScope.user.passwd = '';
                $rootScope.user.isLoggedIn = true;
                $scope.error = '';
                $state.go('feed');
            }).error(function (data) {
                $scope.error = data.error;
            });
        }
    }).
    controller('FeedController', function ($scope, $rootScope, $http) {
        var createRant = function () {
            return {
                userName: $rootScope.user.username,
                rantText: ''
            };
        };
        $scope.rants = [];
        $scope.currentRant = createRant();
        $http.get('/api/rants').success(function (data) {
            $scope.rants = data
            $scope.error = '';
        }).error(function (data) {
            $scope.error = 'Could not load rants';
        });
        //TODO:Yaniv: this function cannot be called delete as "delete" is reserved word in JS
        $scope.delete = function (idx) {
            var rant = $scope.rants[idx];
            $http.delete('/api/rants/' + rant.id).success(function () {
                $scope.rants.splice(idx, 1);
            }).error(function () {
                $scope.error = 'Could not remove rant';
            });
        };
        $scope.post = function () {
            $http.post('/api/rants/', $scope.currentRant).success(function () {
                $scope.error = '';
                $scope.rants.push(currentRant);
                $scope.currentRant = createRant();
            }).error(function () {
                $scope.error = 'Cannot publish rant';
            });
        };
    });

