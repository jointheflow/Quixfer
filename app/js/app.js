var buxferConst = buxferConst || {
	applicationName: "Quixfer",
	applicationVersion: "1.0.0-beta"
};

// Create a new module
var buxferModule = angular.module('buxferModule', ['ngRoute', 'ui.bootstrap', 'ngCordova', 'ngTagsInput']);

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
      when('/info', {
        //templateUrl: 'view-about',
		templateUrl: 'view/view-info.html'
        //controller: 'GlobalController'
      }).
	  when('/synch', {
        //templateUrl: 'view-about',
		templateUrl: 'view/view-sync.html',
        controller: 'SyncController'
      }).
	  when('/credits', {
			//templateUrl: 'view-about',
			templateUrl: 'view/view-credits.html'
			//controller: 'SyncController'
	  }).
      otherwise({
        redirectTo: '/add',
		controller: 'GlobalController'
      });
  }]);

//configure an exception handler that override the default implementation
//showing an alert in the browser
buxferModule.config(function($provide) {
    $provide.decorator("$exceptionHandler", ["$delegate", "$injector", "$log", function($delegate, $injector, $log) {
        return function(exception, cause) {
            
            $delegate(exception, cause);
			
            $log.error(exception + " caused by "+cause);
			/* Alert manager start */
			/*Avoid Circular dependency found: $modal <- $exceptionHandler <- $rootScope
			we need to call the $injector manually to resolve the dependency at runtime*/
			var ServiceBuxferUIAlert;
			ServiceBuxferUIAlert = $injector.get('ServiceBuxferUIAlert');
			var modalOptions = {
                closeButtonText: 'Cancel',
                headerText: buxferConst.applicationName,
                bodyText: exception.message,
                alertType: 'danger'
            };

            ServiceBuxferUIAlert.showModal({}, modalOptions).then(function (result) {
                //$log.info('close alert');
                   
            });
			/* Alert manager end */
			//alert(exception.message);		        
    	};
  	}
  ]);
});





					 
					 