/* SettingsController is used to manage settings view*/
buxferModule.controller('SettingsController', 
    
    function ($scope, ServiceBuxferModel, ServiceBuxferAPI) {
        
		
		//Add a new user in the app
        $scope.addUser = function () {
            var user0;
            
            user0 = new User($scope.username);
            user0.password = $scope.password;
            user0.savePassword = $scope.savePassword;
            
            //add user to the model
            ServiceBuxferModel.buxferModel.addUser(user0);
            
            //set current user
            ServiceBuxferModel.buxferModel.setCurrentUser(user0);
            
            //persist the model to the local storage
            ServiceBuxferModel.commit();
            
            //refresh the scope
            //$scope.users = ServiceBuxferModel.buxferModel.users;
			//TODO: check why $scope.currentUser must be explicitly refreshed while $scope.users
            //is refreshed automatically
            $scope.currentUser = ServiceBuxferModel.buxferModel.currentUser;
            //reload the page to update user info on navbar
            window.location.reload();			
            
        };
        
         
        $scope.removeUser = function (username) {
            //remove user from model
            ServiceBuxferModel.buxferModel.removeUser(username);
            
            //commit the model to the local storage
            ServiceBuxferModel.commit();
            
            //refresh scope's users
            //$scope.users = ServiceBuxferModel.buxferModel.users;
			//TODO: check why $scope.currentUser must be explicitly refreshed while $scope.users
            //is refreshed automatically
            $scope.currentUser = ServiceBuxferModel.buxferModel.currentUser;
            //reload the page to update user info on navbar
            window.location.reload();
        
        };
        
        $scope.setCurrent = function (user) {
            //set current user
            ServiceBuxferModel.buxferModel.setCurrentUser(user);
            //commit the model to the local storage
            ServiceBuxferModel.commit();
            
            //refresh scope's user
            $scope.currentUser = ServiceBuxferModel.buxferModel.currentUser;
            //TODO: implement a better solution ti refresh current user value in the navbar!!!
            window.location.reload();
                    
        };
        
       
});