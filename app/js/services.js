/***************************SERVICE USERS MODEL*********************************************/
/*Create a global users model used to:
/* - sharing data between controllers
/* - retrieving users from local storage
/* - saving user to the local storage */

buxferModule.service('ServiceBuxferModel', function() {
    
    this.serviceName = 'ServiceBuxferModel';
    this.buxferModel = new BuxferModel();
    
    //refresh the buxfer model reading the local storage
    this.refresh = function() {
        console.log(this.serviceName+".refresh() begin");
        var userStorage, user, currentUserName;
		//reset the users array
        this.buxferModel.users = [];
        //reset the currenti user
        this.buxferModel.currentUser = null;
		
        //retrieve user from local storage
        for (var i = 0; i < localStorage.length; i++){
            //for each key get user
            //if keyname not equal '1q2w3e4r_default_5t6y7u' (contains current user name) key must be a user
            if (localStorage.key(i) != this.buxferModel.currentUserKey ) {
                userStorage = localStorage.getItem(localStorage.key(i));
                
				userObject = JSON.parse(userStorage);
                
                user = new User();
                //set properties of the user fro userObject
                user.username = userObject.username;
                user.password = userObject.password;
                user.savePassword = userObject.savePassword;
                user.transactionList = userObject.transactionList;
                user.tagList =userObject.tagList;
                //push user to the global model
                this.buxferModel.users.push(user);
            //otherwhise key is the default user
            }else {
                userStorage = localStorage.getItem(localStorage.key(i));
                //userObject = JSON.parse(userStorage);
               currentUserName = userStorage;
            }
        }
		
		//set the current user object
		for (var i = 0; i< this.buxferModel.users.length; i++) {
			if (currentUserName == this.buxferModel.users[i].username) {
				this.buxferModel.currentUser = this.buxferModel.users[i];
			} 
		}
        console.log(this.serviceName+".refresh() end");
    };
    
    this.refresh();
        
    //save the user using username as a key
    this.saveUser = function(aUser) {
        var userString, transactionString;
        console.log(this.serviceName + ".saveUser() begin");
        
        userString = flatStringify(aUser);
        //transactionString = JSON.stringify(aUser.transactionList);
        
       // console.log(transactionString);
        localStorage.setItem(aUser.username, userString );
        console.log(userString);
        console.log(this.serviceName + ".saveUser() end");
    };
    
    //save default user
    this.saveCurrentUser = function (aUser) {
        console.log(this.serviceName + ".saveCurrentUser() begin");
        if (aUser != null) {
            this.currentUser = aUser
            localStorage.setItem(this.buxferModel.currentUserKey, this.currentUser.username);
        }
        console.log(this.serviceName + ".saveCurrentUser() end");
    };
    
    //persists all the buxfermodel to the local storage
    this.commit = function () {
        //deletes all users in the local storage
        localStorage.clear();
        
        //persists all user
        for (var i=0; i<this.buxferModel.users.length; i++) {
            this.saveUser(this.buxferModel.users[i])
        }
        //persists current users
        this.saveCurrentUser (this.buxferModel.currentUser);
    };
    
    

}); 

    
   

/****************************BUXFER API*************************************************
/* Creates a service to interact directly with buxferAPI.
/* Provides mashup access to the BuxFer Api (https://www.buxfer.com/help/api),  */

var BYC = BYC || {
       
		buxferUrlAPI: "https://www.buxfer.com/api/",
		buxferLoginAPI: "login.json?",
		buxferAddTransAPI: "add_transaction.json?",
        buxferTagsAPI: "tags.json?",
        
		errorCodeDoLoginFailed: -100,
        errorCodeDoLoginNoSuchCode: -101,
        errorCodeDoAddTransactionFailed: -200,
        errorCodeDoAddTransactionNoSuchCode: -201,
        errorCodeDoAddTransactionCheckInputParam: -202,
	 	errorCodeDoGetTagsFailed: -300,
    	errorCodeConnectionProblem: -900,    
		
		errorMsgConnectionProblem: "Connection problem",
    	errorMsgLoginFailed: "Login failed!",
		successMsgDoLogin: "Login success",    
		successMsgDoAddTransaction: "Transaction added",
        successMsgDoGetTags : "Get tags success",
       
        resultStatusOK: "OK",
        resultStatusERROR: "ERROR"
};	 

	
	
buxferModule.service('ServiceBuxferYQL', function($http) {

	
    this.doLogin = function (userid, password) {
		var queryUrl = BYC.buxferUrlAPI + BYC.buxferLoginAPI + "userid=" + userid + "&password=" + password ;
		
		console.log("doLogin start:"+userid+","+password);
		console.log(queryUrl);
		console.log("doLogin end:"+userid+","+password);
		
		return $http({method: 'GET', url:queryUrl});
		
    };
    
    
	this.doAddTransaction = function (token, transaction) {
	   var queryUrl = BYC.buxferUrlAPI + BYC.buxferAddTransAPI +"token=" + token + "&format=sms&text=" + transaction.description + (transaction.type=="expense"?" ":" +") + transaction.amount + " tags:" + transaction.tags + " date:" + transaction.date;
        console.log(queryUrl);
        return $http({method: 'POST', url: queryUrl, id: transaction.id});//passing id of transaction in the config object to manage asyncronous results
	};
    
    
	
	this.doGetTags = function (token) {
		 var queryUrl = BYC.buxferUrlAPI + BYC.buxferTagsAPI +"token=" + token;
        console.log(queryUrl);
        return $http({method: 'GET', url: queryUrl});
	};
    
    
    // manage YQL xml response
    this.manageDoLoginSuccess = function (data) {
    // return some json message or exception 
        var dataObj= data;
		var buxferResult = new BuxferResult();
        if (dataObj.response !=null) {
				console.log("ok, token is:"+dataObj.response.token);
				buxferResult.status = BYC.resultStatusOK;
				buxferResult.value = dataObj.response.token;
				buxferResult.msg = BYC.successMsgDoLogin;
				
				
        } else if (dataObj.results.error !=null) {
				console.log("error, message is:"+dataObj.results.error.message);
				buxferResult.status = BYC.resultStatusERROR;
				buxferResult.value = BYC.errorCodeDoLoginFailed;
				buxferResult.msg = dataObj.query.results.error.message;
				
				
        } else {
				console.log('no such code ');
				buxferResult.status = BYC.resultStatusERROR;
				buxferResult.value=BYC.errorCodeDoLoginNoSuchCode;
				buxferResult.msg=BYC.errorMsgLoginFailed;
				
        }
        return buxferResult;
			
    };
    
    this.manageDoLoginError = function (data) {
		var buxferResult = new BuxferResult();
    	console.log("error, message is:"+data.error.message);
		buxferResult.status = BYC.resultStatusERROR;
		buxferResult.value = BYC.errorCodeDoLoginFailed;
		buxferResult.msg = data.error.message;
    	return buxferResult;
	};
	
});
	
	
	
//****************************UTILS******************************************************/
//add to manage prototype stringify (http://stackoverflow.com/questions/8779249/how-to-stringify-inherited-objects-to-json?lq=1)

function flatStringify(x) {
    for(var i in x) {
        if(!x.hasOwnProperty(i)) {
            // weird as it might seem, this actually does the trick! - adds parent property to self
            x[i] = x[i]; 
        }
    }
    return JSON.stringify(x);
}