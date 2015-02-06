/* GloBalController is used to initialize the scope with users and current user, fetching it from local storage. GlobalController is defined at Application Level.*/
buxferModule.controller('GlobalController', 
    
    function ($scope, ServiceBuxferModel) {
        
        //fetching buxfer model from local storage
        ServiceBuxferModel.fetchFromLocalStorage();
        //initialize the scope with the users fetched from local storage
        $scope.users = ServiceBuxferModel.buxferModel.users;
        $scope.currentUser = ServiceBuxferModel.buxferModel.currentUser;
        
       
});


        
        
        
       
		
		 
        