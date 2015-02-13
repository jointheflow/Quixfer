/* AdUserController is used to manage user adding in the add user modal view*/
buxferModule.controller('AddUserController', 
    
    function ($scope, ServiceBuxferModel, ServiceBuxferAPI, $modal, $log, $modalInstance, globalLoader) {
         /*loader icon manager: assign globalLoader to the local scope variable*/
        $scope.loader = globalLoader;
        
        
		//Add a new user in the app
        $scope.addUser = function () {
            $scope.loader.showloader();
            //$scope.showloader();
            var user0;
            var buxferResult;
            
            user0 = new User($scope.username);
            user0.password = $scope.password;
            user0.savePassword = $scope.savePassword;
            
            //execute login service
            var loginPromiseResponse = ServiceBuxferAPI.doLogin(user0.username, user0.password);
            
            //manage success result
            loginPromiseResponse.success(function(data, status, headers, config) {
                console.log("RESULT:"+data);
                //get buxferResult from xml data
                buxferResult = ServiceBuxferAPI.manageDoLoginSuccess(data);
                console.log("buxferResult.status:"+buxferResult.status+",   buxferResult.value:"+buxferResult.value+", buxferResult.msg:"+buxferResult.msg);
                //if login is ok, use token returned and synchronize all transactions in the model and synch tag from server
                if (buxferResult.status == BYC.resultStatusOK) {
                    //if success, add user to the model
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
                    $scope.loader.hideloader();
                
                }else {
                    //log and show error
                    console.error(buxferResult.status+" "+buxferResult.msg);
                    $scope.loader.hideloader();
					
					throw new Error(buxferResult.msg);
                }
            
            
            		
            
            });
            
            
             //manage error result
            loginPromiseResponse.error(function(data, status, headers, config) {
                buxferResult = ServiceBuxferAPI.manageDoLoginError(data);    
				console.error(buxferResult.msg);
                $scope.loader.hideloader();
				
				throw new Error(buxferResult.msg);
            });
            
        };
            
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }; 
             
       
});