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

	
	
buxferModule.service('ServiceBuxferAPI', function($http) {

	
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
    
	
	this.manageDoGetTagSuccess = function (data) {
		var dataObj= data;
		var buxferResult = new BuxferResult();
		var tagList = [];
		if (dataObj.response != null) {
			
			for (var i=0; i<dataObj.response.tags.length; i++) {
				tagList.push(dataObj.response.tags[i]['key-tag'].name);
			}
			buxferResult.value=tagList;
		
		} else if (data.result.error != null) {
		//TODO
		}else {
		//TODO
		}
		return buxferResult;
	};
	//TODO
    this.manageDoGetTagError = function (data) {
	
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
    
    this.manageDoLoginError = function (data, status, headers, config) {
		var buxferResult = new BuxferResult();
    	console.error("status:"+ status);
        console.log("error, message is:"+data);
		buxferResult.status = BYC.resultStatusERROR;
		buxferResult.value = BYC.errorCodeDoLoginFailed;
		buxferResult.msg = data.error;
    	return buxferResult;
	};
	
	 this.manageDoAddTransactionError = function (data, status, headers, config) {
		var buxferResult = new BuxferResult();
    	console.error("status:"+ status);
        console.log("error, message is:"+data.error.message);
		buxferResult.status = BYC.resultStatusERROR;
		buxferResult.value = BYC.errorCodeDoAddTransactionFailed;
		buxferResult.msg = data.error;
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