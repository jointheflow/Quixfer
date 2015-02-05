/*AddController exposes all function necessary to the add-view. Since is used inside GlobalController it can see all properties defined in the GlobalController scope (parent)*/
buxferModule.controller('AddController', 
    
    function ($scope, ServiceBuxferModel, ServiceBuxferYQL) {
        
        //refresh localtag array from Buxfer server
		$scope.refreshTagData = function (modelTagList) {
			tagData = [];
			if (modelTagList !=null) {
				for (var i=0; i<modelTagList.length; i++) {
					tagData.push({id: i, label: modelTagList[i]});
				}
			}
			return tagData;
		};
		
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
		};
		
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
        };
        
      	
		$scope.updateTags = function (tagList) {
			ServiceBuxferModel.buxferModel.currentUser.tagList=tagList;
			//commit the model to the local storage
            ServiceBuxferModel.commit();
		
		};
        
       
		
		
		
		
});


        
        
        
       
		
		 
        
