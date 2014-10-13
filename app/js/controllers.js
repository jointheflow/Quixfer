buxferModule.controller('GlobalController', 
    function ($scope, ServiceBuxferModel, ServiceBuxferYQL) {
        //initialize the scope with the users from local storage
        $scope.users = ServiceBuxferModel.buxferModel.users;
        $scope.currentUser = ServiceBuxferModel.buxferModel.currentUser;
		
		//define init of view view-add.html
		$scope.initViewAdd = function () {
			$scope.description="";
            $scope.amount=0;
            $scope.tag="";
            $scope.transdate=
			$scope.type="Expense";
			var d=new Date();
    		var year=d.getFullYear();
			var month=d.getMonth()+1;
    		if (month<10){
      			month="0" + month;
			}
			
    		var day=d.getDate();
			if (day<10){
      			day="0" + day;
			}
    		$scope.transdate=year + "-" + month + "-" + day
		}
		
		//initialize view-add view
		$scope.initViewAdd();
        
        //add a new transaction to the $scope.currentUser's 
		$scope.addTransaction = function (transType) {
            var t0, user0;
            //create the transaction
			t0= new LocalTransaction();
            t0.description=$scope.description;
            t0.amount=$scope.amount;
            t0.tags=$scope.tag;
            t0.date=$scope.transdate;
			if (transType != null) {
				t0.type = transType; 
			
			}else {
				t0.type=$scope.type;
			}
            
			//get the current user
            user0 = $scope.currentUser;
            if (user0==null) {
                throw "You must select a current user!"
            }
			//add transaction to the user
            user0.addTransaction(t0);
           
			//persist the model to the local storage
            ServiceBuxferModel.commit();
			
			//show message
			alert("Transaction added!");
			//reset view-add
			$scope.initViewAdd();
        }
        
        //Add a new user in the app
        $scope.addUser = function () {
            var user0;
            
            user0 = new User($scope.username);
            user0.password = $scope.password;
            user0.savePassword = $scope.savePassword
            
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
            
			
            
            
        }
        
         
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
        
        } 
        
        $scope.setCurrent = function (user) {
            //set current user
            ServiceBuxferModel.buxferModel.setCurrentUser(user);
            //commit the model to the local storage
            ServiceBuxferModel.commit();
            
            //refresh scope's user
            //TODO: check why $scope.currentUser must be explicitly refreshed while $scope.users
            //is refreshed automatically
            $scope.currentUser = ServiceBuxferModel.buxferModel.currentUser;
            window.location.reload();
            //reload the page to update user info on navbar
            window.location.reload();
        
        }
        
        $scope.removeTransaction = function (transactionid) {
            //remove transaction of current user from model
            ServiceBuxferModel.buxferModel.currentUser.removeTransaction(transactionid);
            
            //commit the model to the local storage
            ServiceBuxferModel.commit();
                 
        }
        
        $scope.updateTransaction = function (aTransaction) {
            //remove user from model
            ServiceBuxferModel.buxferModel.currentUser.updateTransaction(aTransaction);
            
            //commit the model to the local storage
            ServiceBuxferModel.commit();
                 
        }
        
        $scope.synchronize = function () {
            var buxferResult;
            //execute login service
            var loginPromiseResponse = ServiceBuxferYQL.doLogin($scope.currentUser.username,    $scope.currentUser.password);
            //manage success result
            loginPromiseResponse.success(function(data, status, headers, config) {
                console.log("RESULT:"+data);
                //get buxferResult from xml data
                buxferResult = ServiceBuxferYQL.manageDoLoginSuccess(data);
                console.log("buxferResult.status:"+buxferResult.status+",   buxferResult.value:"+buxferResult.value+", buxferResult.msg:"+buxferResult.msg);
                //if login is ok, use token returned and synchronize all transactions in the model
                if (buxferResult.status == BYC.resultStatusOK) {
                    var currUser =ServiceBuxferModel.buxferModel.currentUser;
                    var transList=currUser.transactionList;    
                    for (var i=0; i<transList.length; i++) {
                        console.log("add:"+transList[i]);
                        var addTransPromiseResponse = ServiceBuxferYQL.doAddTransaction(buxferResult.value, transList[i])
                        
                        addTransPromiseResponse.success(function(data, status, headers, config) {
                            //remove synchronized transaction, the transaction id is contained in the config parameter
                            $scope.removeTransaction(config.id);
                        });
                        
                        addTransPromiseResponse.error(function(data, status, headers, config) {
                        	buxferResult = ServiceBuxferYQL.manageDoAddTransactionError(data);
                        	throw new Error(buxferResult.msg);
                        });
                    }
                }else {
                    //log and show error
                    console.error(buxferResult.status+" "+buxferResult.msg);
					throw new Error(buxferResult.msg);
                }
            });
            
            //manage error result
            loginPromiseResponse.error(function(data, status, headers, config) {
                buxferResult = ServiceBuxferYQL.manageDoLoginError(data);    
				console.error(buxferResult.msg);
					throw new Error(buxferResult.msg);
            });
        }
		 
        
		
		//refresh localtag array from Buxfer server
		$scope.refreshTag = function () {
		
		}
		
		
});


        
        
        
       
		
		 
        
