'use strict';

/* Controllers */

angular.module('ranter.controllers', ['ranter.services']).
  controller('AppCtrl', function ($scope, $http, $location) {

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

  }).
  controller('RegisterController', function ($scope, $rootScope, $location, registerService) {
       $scope.events = {register: function(){
        registerService.register($scope.model.username, $scope.model.description, $scope.model.image, $scope.model.password)
          .success(function(result){
            $rootScope.rootModel = {};
            $rootScope.rootModel.registerData = result;

            $location.path('/wall');
          })
          .error(function(data, status){

          });
    }}
  }).controller('LoginController', function ($scope, $rootScope, $http, $location) {
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
        $location.path('/feed');
      }).error(function (data) {
        $scope.error = data.error;
      });
    }
  }).
  controller('FeedController', function () {
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

