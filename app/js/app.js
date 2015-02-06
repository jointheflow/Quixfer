// Create a new module
var buxferModule = angular.module('buxferModule', ['ngRoute', 'ui.bootstrap', 'angularjs-dropdown-multiselect', 'ngCordova']);

// configure application routes
buxferModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/add', {
        //templateUrl: 'view-add',
		templateUrl: 'view/view-add.html',
        controller: 'AddController'
      }).
      when('/settings', {
        //templateUrl: 'view-settings',
		templateUrl: 'view/view-settings.html',
        controller: 'SettingsController'
      }).
      when('/about', {
        //templateUrl: 'view-about',
		templateUrl: 'view/view-about.html'
        //controller: 'GlobalController'
      }).
	  when('/synch', {
        //templateUrl: 'view-about',
		templateUrl: 'view/view-sync.html',
        controller: 'SyncController'
      }).
      otherwise({
        redirectTo: '/add',
		controller: 'GlobalController'
      });
  }]);

//configure an exception handler that override the default implementation
//showing an alert in the browser
buxferModule.config(function($provide) {
    $provide.decorator("$exceptionHandler", ['$delegate', function($delegate) {
        return function(exception, cause) {
            $delegate(exception, cause);
            alert(exception.message);
			
        };
    }]);
});
					 
					 