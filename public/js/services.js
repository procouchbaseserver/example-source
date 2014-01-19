'use strict';

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

mod.service('aboutService',function($http,$q){
	return {getTop: function(username){
		return $http.get('api/rants/about/' + username);
	}}
});