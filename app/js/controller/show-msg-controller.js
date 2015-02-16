/* ShowMsgController is used to manage alert msg generated by the application in a centralized point*/
buxferModule.controller('ShowMsgController', 
    
    function ($scope, $modal, $log, $modalInstance, alerts, focusTo) {
        
        $scope.alerts = alerts;
		
		$scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
			//when the alert is closed, set focus to the destination
			//passed as a parameter
			document.getElementById(focusTo).focus();
			
			$modalInstance.dismiss('cancel');
        };
        
});