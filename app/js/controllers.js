buxferModule.controller('GlobalController', 
    
    function ($scope, ServiceBuxferModel, ServiceBuxferYQL) {
        
        //fetching buxfer model from local storage
        ServiceBuxferModel.fetchFromLocalStorage();
        //initialize the scope with the users fetched from local storage
        $scope.users = ServiceBuxferModel.buxferModel.users;
        $scope.currentUser = ServiceBuxferModel.buxferModel.currentUser;
		
		//refresh localtag array from Buxfer server
		$scope.refreshTagData = function (modelTagList) {
			tagData = [];
			if (modelTagList !=null) {
				for (var i=0; i<modelTagList.length; i++) {
					tagData.push({id: i, label: modelTagList[i]});
				}
			}
			return tagData;
		}
		
		//define init of view view-add.html
		$scope.initViewAdd = function () {
			$scope.description="";
            $scope.amount=0;
			$scope.tagtext ="";
            
			//start managing load of multiple item dropdown menù for tags attribute 
			$scope.tag= [];
			//populate tagdata with tags in the model associatew with the current user
			if ($scope.currentUser!=null)
				$scope.tagdata = $scope.refreshTagData($scope.currentUser.tagList);
			//use label as id, and show max 10 option selected in the menù
			$scope.tagdatasetting= {smartButtonMaxItems: 10, displayProp: 'label', idProp: 'label'};
			//end managing load of multiple item dropdown menù for tags attribute
			
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
            //concatenate all tags selected in the dropdown menù
			for (var i=0; i<$scope.tag.length; i++) {
				if (i==0) t0.tags=$scope.tag[i].id;
				else t0.tags=t0.tags + ","+$scope.tag[i].id;
			}
			//add free tag text if exists
			if ($scope.tagtext !=null ) {
				if (t0.tags.length>0 )
					t0.tags=t0.tags+","+$scope.tagtext;
			    else
					t0.tags=$scope.tagtext;
			}
			
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
            $scope.currentUser = ServiceBuxferModel.buxferModel.currentUser;
            //TODO: implement a better solution ti refresh current user value in the navbar!!!
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
		
		
		$scope.updateTags = function (tagList) {
			ServiceBuxferModel.buxferModel.currentUser.tagList=tagList;
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
                //if login is ok, use token returned and synchronize all transactions in the model and synch tag from server
                if (buxferResult.status == BYC.resultStatusOK) {
                    var currUser =ServiceBuxferModel.buxferModel.currentUser;
                    var transList=currUser.transactionList;  
					
					
					//synchro all transaction
                    for (var i=0; i<transList.length; i++) {
                        console.log("add:"+transList[i]);
                        var addTransPromiseResponse = ServiceBuxferYQL.doAddTransaction(buxferResult.value, transList[i]);
                        
                        addTransPromiseResponse.success(function(data, status, headers, config) {
                            //remove synchronized transaction, the transaction id is contained in the config parameter
                            $scope.removeTransaction(config.id);
                        });
                        
                        addTransPromiseResponse.error(function(data, status, headers, config) {
                        	buxferResult = ServiceBuxferYQL.manageDoAddTransactionError(data);
                        	throw new Error(buxferResult.msg);
                        });
                    }
					
					
					
					//get Tag from server
					var getTagPromiseResponse = ServiceBuxferYQL.doGetTags(buxferResult.value);
					//manage get tag ok
					getTagPromiseResponse.success(function(data, status, headers, config) {
						//add tags to the model and save it
						buxferResult = ServiceBuxferYQL.manageDoGetTagSuccess(data);
						$scope.updateTags(buxferResult.value);
						
					});
					//manage get tag error
					getTagPromiseResponse.error(function(data, status, headers, config) {
						buxferResult = ServiceBuxferYQL.manageDoGetTagError(data);    
						console.error(buxferResult.msg);
						throw new Error(buxferResult.msg);
					});
			
					
					
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
		 
        
		
		
		
		
		
		
});


        
        
        
       
		
		 
        
