/*Not used but may be useful as a boilerplate for intecept pre e post request*/
/*buxferModule.factory('httpRequestInterceptor', ['$q', function($q) {  
    var httpRequestInterceptor = {
			requestError: function(rejectReason) {
						return $q.reject(rejectReason);
			},
			request: function(config) {
				config.requestTimestamp = new Date().getTime();
				return config;
			},
			response: function(response) {
				response.config.responseTimestamp = new Date().getTime();
				return response;
			},
			responseError: function(response) {
				response.config.responseTimestamp = new Date().getTime();
				return response;
			}
        };
    
    return httpRequestInterceptor;
}]);
*/
/*buxferModule.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('httpRequestInterceptor');
   
}]);*/