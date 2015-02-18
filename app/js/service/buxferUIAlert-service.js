/*This service is used to create and show alert in a centralized point
The service follow Dan Wahlin's implementaion. http://weblogs.asp.net/dwahlin/building-an-angularjs-modal-service */
buxferModule.service('ServiceBuxferUIAlert',  function ($modal) {

        this.serviceName = 'ServiceBuxferUIAlert';
        
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'view/view-alertGlobal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            //actionButtonText: 'OK',
            alertType: 'success',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    /*$scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };*/
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.close('cancel');
                    };
                }
            }

            return $modal.open(tempModalDefaults).result;
        };

});
    
    
