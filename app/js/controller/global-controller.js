/* GloBalController is used to initialize the scope with users and current user, fetching it from local storage. GlobalController is defined at Application Level.*/
buxferModule.controller('GlobalController', 
    
    function ($scope, ServiceBuxferModel, $modal, $log) {
        
        
        
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
		
		
		/*defining and managing alert*/
      	$scope.showMsg = function (_msg, _tpe) {
            var l_alerts =[{type: _tpe, msg: _msg}];
			
			var modalInstance = $modal.open({
              templateUrl: 'showMessageModal.html',
              controller: 'ShowMsgController',
              resolve: {
                alerts: function () {
                  return l_alerts;
                }
              }
            });

            modalInstance.result.then(function () {
              //$scope.selected = selectedItem;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        };
		
        
        
        //set focus to destinationId basing key event and key code
        //for example key code 13 correponds to RETURN
        $scope.setFocus = function(keyEvent, keyCode, destinationId) {
            if (keyEvent.which === keyCode) { 
                //alert('Focus to '+destinationId);
                var element = document.getElementById(destinationId);
                if(element)
                    element.focus();
            }
        };
		
});


        
        
        
       
		
		 
        
