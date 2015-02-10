/* GloBalController is used to initialize the scope with users and current user, fetching it from local storage. GlobalController is defined at Application Level.*/
buxferModule.controller('GlobalController', 
    
    function ($scope, ServiceBuxferModel) {
        
        //fetching buxfer model from local storage
        ServiceBuxferModel.fetchFromLocalStorage();
        //initialize the scope with the users fetched from local storage
        $scope.users = ServiceBuxferModel.buxferModel.users;
        $scope.currentUser = ServiceBuxferModel.buxferModel.currentUser;
        $scope.tagtext= [];
        //$scope.tagexample = [{ text: 'Tag1' }, { text: 'Tag2' },{ text: 'Tag3' }] ;
        //$scope.tagexample = ['Tag1', 'Tag2', 'Tag3'] ;
        
        /*loader icon manager begin*/
        $scope.loader = {
            loading: false,
        };
        $scope.showloader = function(){
            $scope.loader.loading = true ;
        }
        $scope.hideloader = function(){
            $scope.loader.loading = false ;
        }
        /*loader icon manager end*/
       
});


        
        
        
       
		
		 
        
