'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var mod = angular.module('ranter.services', []);
mod.service('loginService',function($http,$q){
		return {login: function(username, password){
			var data = {
				username: username,
				password: password
			};
			return $http.post('/api/login',data);
		}}		
	});

mod.service('registerService',function($http,$q){
		return {register: function(username, description, image, password){
			var data = {
				username: username,
                description: description,
                image: image,
				password: password
			};
			return $http.post('/api/register', data);
		}}            		
	});
