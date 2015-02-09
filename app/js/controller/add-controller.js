/*AddController exposes all function necessary to the add-view. Since is used inside GlobalController it can see all properties defined in the GlobalController scope (parent)*/
buxferModule.controller('AddController', 
    
    function ($scope,$q, ServiceBuxferModel) {
        
        //list of tag for current user
        $scope.tagdata = [];
        
        $scope.loadTags = function(query) {
            var deferred = $q.defer();
            deferred.resolve($scope.tagdata);
            return deferred.promise;    
            
        };
        //refresh localtag array from Buxfer server
		$scope.refreshTagData = function (modelTagList) {
			tagData = [];
			if (modelTagList !=null) {
				for (var i=0; i<modelTagList.length; i++) {
					//adding element only if it does not exists!
                    if (tagData.indexOf(modelTagList[i]) <0) {
                        //tagData.push({id: i, name: modelTagList[i]});
                        tagData.push(modelTagList[i]);
                    }
				}
			}
			return tagData;
		};
		
		//define init of view view-add.html
		$scope.initViewAdd = function () {
			$scope.description="";
            //$scope.amount=0;
			$scope.tagtext ="";
            
			//start managing load of multiple item dropdown menù for tags attribute 
			$scope.tagdata = [];
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
		};
		
		//initialize view-add view
		$scope.initViewAdd();
        
        //add a new transaction to the $scope.currentUser's 
		$scope.addTransaction = function (transType) {
            var t0, user0;
            
            //get the current user
            user0 = $scope.currentUser;
            if (user0==null) {
                throw "You must select a current user!"
            }
            
            //create the transaction
			t0= new LocalTransaction();
            t0.description=$scope.description;
            t0.amount=$scope.amount;
            //concatenate all tags selected by the user and also new tags 
			for (var i=0; i<$scope.tagtext.length; i++) {
				if (i==0) t0.tags=$scope.tagtext[i].text;
				else t0.tags=t0.tags + ","+$scope.tagtext[i].text;
                //add each tag selected by the user to the current user localTagList 
                //for the next insertion (added only if tag does not exists)
                
                user0.addTag($scope.tagtext[i].text);
                
            }
			//add free tag text if exists
			/*if ($scope.tagtext !=null ) {
				if (t0.tags.length>0 )
					t0.tags=t0.tags+","+$scope.tagtext;
			    else
					t0.tags=$scope.tagtext;
			}
			*/
            t0.date=$scope.transdate;
			if (transType != null) {
				t0.type = transType; 
			
			}else {
				t0.type=$scope.type;
			}
            
			
			//add transaction to the user
            user0.addTransaction(t0);
            
            //TODO: add all new inserted tag to the current user
            
			//persist the model to the local storage
            ServiceBuxferModel.commit();
			
			//show message
			alert("Transaction added!");
			//reset view-add
			$scope.initViewAdd();
        };
        
});


        
        
        
       
		
		 
        
