'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('ranter.services', []).
	service('loginService',function($http,$q){
		return {login: function(username, password){
			var data = {
				username: username,
				password: password
			};
			return $http.post('/api/login',data);
		}}
		
	});
