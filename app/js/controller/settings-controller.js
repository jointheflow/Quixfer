/* SettingsController is used to manage settings view*/
buxferModule.controller('SettingsController', 
    
    function ($scope, ServiceBuxferModel, ServiceBuxferAPI, $modal, $log) {
             
        
		$scope.saveConfiguration = function() {
			 ServiceBuxferModel.commit();
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
        
        $scope.openAddUser = function (size) {
            var modalInstance = $modal.open({
              templateUrl: 'view/view-addUserModal.html',
              controller: 'AddUserController',
              size: size,
              resolve: {
                globalLoader: function () {
                  return $scope.globalLoader;
                }
              }
            });

            modalInstance.result.then(function () {
              //$scope.selected = selectedItem;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        };

       
       
});