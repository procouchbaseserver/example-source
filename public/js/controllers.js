'use strict';

/* Controllers */

angular.module('ranter.controllers', ['ranter.services']).
  controller('AppCtrl', function ($scope, $http) {

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
  controller('rootController', function ($scope, $rootScope, loginService) {
    $scope.events = {login: function(){
        loginService.login($scope.model.username, $scope.model.password)
          .success(function(result){
            $rootScope.rootModel = {};
            $rootScope.rootModel.loginData = result;
          })
          .error(function(data, status){

          });
    }}

  }).
  controller('WallController', function ($scope) {
    // write Ctrl here

  });