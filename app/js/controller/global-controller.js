/* GloBalController is used to initialize the scope with users and current user, fetching it from local storage. GlobalController is defined at Application Level.*/
buxferModule.controller('GlobalController', 
    
    function ($scope, ServiceBuxferModel) {
        
        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
        /*    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
            { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
        ];
        */
        //fetching buxfer model from local storage
        ServiceBuxferModel.fetchFromLocalStorage();
        //initialize the scope with the users fetched from local storage
        $scope.users = ServiceBuxferModel.buxferModel.users;
        $scope.currentUser = ServiceBuxferModel.buxferModel.currentUser;
        //initialize scope tagtext
        $scope.tagtext= [];
       
        
        /*defining loader icon manager, show and hide method */
        Loader = function(booleanDefault) {
            this.loading = booleanDefault;           
        };
        Loader.prototype.showloader = function() {
            this.loading = true;
        };        
        Loader.prototype.hideloader = function() {
            this.loading = false;
        };
        //loader instantiation: we will use the global loader in the rest of the application
        $scope.globalLoader = new Loader(false);
        /*loader icon manager end*/
       
});


        
        
        
       
		
		 
        
