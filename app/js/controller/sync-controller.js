/* SyncController is used to manage synch view tamplate.*/
buxferModule.controller('SyncController', 
    
    function ($scope, ServiceBuxferModel, ServiceBuxferAPI) {
        
        
        //inserts all tags to the taglist of currentuser in the model
        $scope.updateTags = function (tagList) {
			ServiceBuxferModel.buxferModel.currentUser.tagList=tagList;
			//commit the model to the local storage
            ServiceBuxferModel.commit();
		};
        
        
        $scope.removeTransaction = function (transactionid) {
            //remove transaction of current user from model
            ServiceBuxferModel.buxferModel.currentUser.removeTransaction(transactionid);
            
            //commit the model to the local storage
            ServiceBuxferModel.commit();
                 
        };
        
        $scope.updateTransaction = function (aTransaction) {
            //remove user from model
            ServiceBuxferModel.buxferModel.currentUser.updateTransaction(aTransaction);
            
            //commit the model to the local storage
            ServiceBuxferModel.commit();
                 
        };
		
		        
        $scope.synchronize = function () {
            $scope.globalLoader.showloader();
            
            var buxferResult;
            //decrypting password
            var decryptedPwd = CryptoJS.AES.decrypt($scope.currentUser.password, ServiceBuxferModel.buxferModel.currentUserKey);
            
            //execute login service
            var loginPromiseResponse = ServiceBuxferAPI.doLogin($scope.currentUser.username,    decryptedPwd.toString(CryptoJS.enc.Utf8));
            //manage success result
            loginPromiseResponse.success(function(data, status, headers, config) {
                console.log("RESULT:"+data);
                //get buxferResult from xml data
                buxferResult = ServiceBuxferAPI.manageDoLoginSuccess(data);
                console.log("buxferResult.status:"+buxferResult.status+",   buxferResult.value:"+buxferResult.value+", buxferResult.msg:"+buxferResult.msg);
                //if login is ok, use token returned and synchronize all transactions in the model and synch tag from server
                if (buxferResult.status == BYC.resultStatusOK) {
                    var currUser =ServiceBuxferModel.buxferModel.currentUser;
                    var transList=currUser.transactionList;  
					
					
					//synchro all transaction
                    for (var i=0; i<transList.length; i++) {
                        console.log("add:"+transList[i]);
                        var addTransPromiseResponse = ServiceBuxferAPI.doAddTransaction(buxferResult.value, transList[i]);
                        
                        addTransPromiseResponse.success(function(data, status, headers, config) {
                            //remove synchronized transaction, the transaction id is contained in the config parameter
                            $scope.removeTransaction(config.id);
                        });
                        
                        addTransPromiseResponse.error(function(data, status, headers, config) {
                        	buxferResult = ServiceBuxferAPI.manageDoAddTransactionError(data);
                        	$scope.globalLoader.hideloader();
                            throw new Error(buxferResult.msg);
                        });
                    }
					
					
					
					//get Tag from server
					var getTagPromiseResponse = ServiceBuxferAPI.doGetTags(buxferResult.value);
					//manage get tag ok
					getTagPromiseResponse.success(function(data, status, headers, config) {
						//add tags to the model and save it
						buxferResult = ServiceBuxferAPI.manageDoGetTagSuccess(data);
						$scope.updateTags(buxferResult.value);
						
					});
					//manage get tag error
					getTagPromiseResponse.error(function(data, status, headers, config) {
						buxferResult = ServiceBuxferAPI.manageDoGetTagError(data);    
						console.error(buxferResult.msg);
                        $scope.globalLoader.hideloader();
						throw new Error(buxferResult.msg);
					});
			
					
				    $scope.globalLoader.hideloader();	
                }else {
                    //log and show error
                    console.error(buxferResult.status+" "+buxferResult.msg);
					$scope.globalLoader.hideloader();
                    throw new Error(buxferResult.msg);
                }
            });
            
            //manage error result
            loginPromiseResponse.error(function(data, status, headers, config) {
                buxferResult = ServiceBuxferAPI.manageDoLoginError(data, status, headers, config);    
				console.error(buxferResult.msg);
                $scope.globalLoader.hideloader();
				throw new Error(buxferResult.msg);
            });
        };
		 
        
		
		
		
		
		
		
});

