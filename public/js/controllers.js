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
  controller('rootController', function ($scope, $rootScope, $location, loginService) {
    $scope.events = {login: function(){
        loginService.login($scope.model.username, $scope.model.password)
          .success(function(result){
            $rootScope.rootModel = {};
            $rootScope.rootModel.loginData = result;

            $location.path('/wall');
          })
          .error(function(data, status){

          });
    }}

  }).
  controller('WallController', function ($scope) {
    // write Ctrl here

  });