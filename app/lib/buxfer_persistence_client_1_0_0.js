/* buxfer_persistence_client_1_0_0
* Buxfer javascript persistence client 1.0.0.
* Provides access to the local storage of the client, hiding low level javascript call.
* To support multiple user, BuxferDB has the following structure in the localStorage.
* Every user is an entry where username is the key of the localstorage. For example:
* key:"BuxferQuickClientMobile"
* value:
* {"tTransactions":
*	{"r61390830708899":{"tDesc":"coffe","tAmount":"0.80","tTag":"cibo,svago","tDate":"2014-01-*23","id":"r61390830708899", "tType":"expense"},
*	 "r121390830708901":{"tDesc":"loan","tAmount":"600.50","tTag":"casa","tDate":"2014-01-23","id":"r121390830708901"},
*	 "r711390830708902":{"tDesc":"benzina scooter","tAmount":"10","tTag":"auto","tDate":"2014-01-23","id":"r711390830708902"},
*	 "r951390830708904":{"tDesc":"update trans","tAmount":"99","tTag":"update","tDate":"2014-01-24","id":"r951390830708904"}},
* "tTags":[{"tName":"casa"},
*	{"tName":"svago"},
*	{"tName":"Sport"}
*	]
*}
*
*
key: "username"
value: {"username":<string>,
        "password":<string>,
        "savePassword":<boolean>,
        "transactionList":<>,
        "tagList":<>
        }

*/
var BPC = BPC || {
		storageType: "local",
		storageNameDefault: "buxferDB",
		logName: "BPC->"
	};


/************************Interface definition*****************************/
/*
* Save transaction in the local storage. Return the transaction id. (-1 if there is an error)
*/
BPC.saveTransaction = function (storageName, aTransaction) {
	if (BPC.storageType == "local") {
		console.log(BPC.logName+"invoke saveTransactionLocal");
		return BPC.saveTransactionLocal(storageName, aTransaction);
	}else
		return -1;
}


/*
* Retrieve the transaction basing on the id. Return the transaction object if exists, null otherwhise.
*/
BPC.getTransaction = function (storageName, id) {
	if (BPC.storageType == "local") {
		console.log(BPC.logName+"invoke getTransactionLocal");
		return BPC.getTransactionLocal(storageName, id);
	}else
		return -1;
}

/*
* Update the transaction in position id with the transaction passed as a parameter. Return id if ok, -1 if error.
*/
BPC.updateTransaction = function (storageName, id, aTransaction) {
	if (BPC.storageType == "local") {
		console.log(BPC.logName+"invoke updateTransactionLocal");
		return BPC.updateTransactionLocal(storageName, id, aTransaction);
	}else
		return -1;
}

/*
* Remove transaction basing on the id. Return id if ok, -1 otherwhise.
*/
BPC.removeTransaction = function (storageName, id) {
	if (BPC.storageType == "local") {
		console.log(BPC.logName+"invoke removeTransactionLocal");
		return BPC.removeTransactionLocal(storageName, id);
	}else
		return -1;
}

/*Return all transactions in the local storage, null otherwhise */
BPC.getAllTransactions = function (storageName) {
	if (BPC.storageType == "local") {
		console.log(BPC.logName+"invoke getAllTransactionsLocal");
		return BPC.getAllTransactionsLocal(storageName);
	}else
		return -1;
}

/*
* Remove all transactions. 
*/
BPC.removeAllTransactions = function () {
if (BPC.storageType == "local") {
		console.log(BPC.logName+"invoke removeAllTransactionsLocal");
		return BPC.removeAllTransactionsLocal();
	}else
		return -1;
}

/*
* Get all tags.
*/

BPC.getAllTags = function (storageName) {
	if (BPC.storageType == "local") {
		console.log(BPC.logName+"invoke getAllTagsLocal");
		return BPC.getAllTagsLocal(storageName);
	}else
		return -1;

}

/*
* Set all tags.
*/
BPC.setAllTags = function (storageName, allTags) {
if (BPC.storageType == "local") {
		console.log(BPC.logName+"invoke setAllTagsLocal");
		return BPC.setAllTagsLocal(storageName, allTags);
	}else
		return -1;
}
/************************Implementation definition*****************************/
/*
* Implements saveTransaction in the localStorage
*/
BPC.saveTransactionLocal = function (storageName, aTransaction) {
	var  buxferDB, parsedBuxferDB, transactionMap, id, rand;
	
	console.log(BPC.logName+"saveTransactionLocal begin");
	//get local storage key
	buxferDB = localStorage.getItem(storageName);
	
	//db does not exist, then create
	if (buxferDB == undefined) {
		parsedBuxferDB = new Object();
	}else {
		//transform the string as json object
		parsedBuxferDB = JSON.parse(buxferDB);
	}
	 
	transactionMap = parsedBuxferDB.tTransactions;
	console.log(BPC.logName+"transaction map:"+transactionMap);
	
	if (transactionMap == undefined) {
		transactionMap = new Object();
	}
	
	//generate unique id combinig r+randomnumber between 1 to 100 + currenttime millisec
	//generate random number
	rand = Math.floor((Math.random()*100)+1);
	//generate unique id
	id = "r" + rand + (new Date()).valueOf();
	
	//assign id to the transaction
	aTransaction.id=id;
	
	if (transactionMap[id]==undefined) {
        //add the transaction
	   transactionMap[id]=aTransaction;
	
    }else {
        //transaction already exists
        return -1;
    }
    
	console.log(BPC.logName+"transaction added:"+id);
	
	//save transaction on the local storage
	parsedBuxferDB.tTransactions=transactionMap;
	localStorage.setItem(storageName, JSON.stringify(parsedBuxferDB));
	console.log(BPC.logName+"transaction saved!");
	console.log(BPC.logName+"transaction map:"+JSON.stringify(transactionMap));
	console.log(BPC.logName+"saveTransactionLocal end");
	return id;
	
}

/*
*Implements updateTransaction in the localSTorage
*/
BPC.updateTransactionLocal = function (storageName, id, aTransaction) {
	var buxferDB, parsedBuxferDB, transactionMap;
	
	console.log(BPC.logName+"updateTransactionLocal begin");
	//get local storage key
	buxferDB = localStorage.getItem(storageName);
	console.log(BPC.logName+"transaction map:"+buxferDB.tTransactions);
	
	//transform the string as json object
	parsedBuxferDB = JSON.parse(buxferDB);
	transactionMap = parsedBuxferDB.tTransactions;
	
	if (transactionMap[id]!=undefined) {
		console.log(BPC.logName+"old transaction:"+JSON.stringify(transactionMap[id]));
		
		//assign id to the transaction
		aTransaction.id=id;
		
		//assign new transaction to the oldone
		transactionMap[id]=aTransaction
	} else {
		console.error(BPC.logName+"transaction does not exists:"+id);
		return -1;
	}

	
	//save transaction on the local storage
	
	localStorage.setItem(storageName, JSON.stringify(parsedBuxferDB));
	console.log(BPC.logName+"transaction updated!");
	console.log(BPC.logName+JSON.stringify(transactionMap));
	console.log(BPC.logName+"updateTransactionLocal end");
	return id;
}

/*
* Implements getTransaction in the localStorage
*/
BPC.getTransactionLocal = function (storageName, id) {
	var buxferDB, parsedBuxferDB, transactionMap;
	
	console.log(BPC.logName+"getTransactionLocal begin");
	//get local storage key
	buxferDB = localStorage.getItem(storageName);
	console.log(BPC.logName+"transaction map:"+buxferDB);
	
	//transform the string as json object
	parsedBuxferDB = JSON.parse(buxferDB);
	transactionMap = parsedBuxferDB.tTransactions;
	console.log(BPC.logName+"transaction:"+JSON.stringify(transactionMap[id]));
	console.log(BPC.logName+"getTransactionLocal end");
	return transactionMap[id];
}

/* 
*Implements removeTransaction in the localStorage 
*/
BPC.removeTransactionLocal = function (storageName, id) {
	var buxferDB, parsedBuxferDB, transactionMap;
	console.log(BPC.logName+"removeTransactionLocal begin");
	//get local storage key
	buxferDB = localStorage.getItem(storageName);
	console.log(BPC.logName+"transaction map:"+buxferDB);
	
	//transform the string as json object
	parsedBuxferDB = JSON.parse(buxferDB);
	transactionMap = parsedBuxferDB.tTransactions;
	
	if (transactionMap[id]!=undefined) {
		console.log(BPC.logName+"old transaction:"+JSON.stringify(transactionMap[id]));
		delete transactionMap[id]
	} else {
		console.error(BPC.logName+"transaction does not exists:"+id);
		return -1;
	}

	
	//save transaction on the local storage
	localStorage.setItem(storageName, JSON.stringify(parsedBuxferDB));
	console.log(BPC.logName+"transaction removed!");
	console.log(BPC.logName+JSON.stringify(transactionMap));
	console.log(BPC.logName+"removeTransactionLocal end");
	return id;
}
/*
* Implements getAllTransactionsLocal
*/
BPC.getAllTransactionsLocal = function (storageName) {
	var buxferDB
	console.log(BPC.logName+"getAllTransactionsLocal begin");
	//get local storage key
	buxferDB = localStorage.getItem(storageName);
	if (buxferDB!=null) {
        console.log(BPC.logName+"transaction map:"+buxferDB);
        
        console.log(BPC.logName+"getAllTransactionsLocal end");
        //convert return in an array
        var sortable = [];
        var transactionList = JSON.parse(buxferDB).tTransactions;
        for (var transaction in transactionList) {
            sortable.push(transactionList[transaction]);
        }
        //transform the string as json object
        return sortable;
    }else {
        return null;
    }
}

/*
* Implements removeAllTransactions from localStorage
*/
BPC.removeAllTransactionsLocal = function () {
	console.log(BPC.logName+"removeAllTransactionsLocal begin");
	//get local storage key
	localStorage.clear();
	console.log(BPC.logName+"removeAllTransactionsLocal end");
}

/*
* Implements getAllTags from localStorage
*/
BPC.getAllTagsLocal = function (storageName) {
	var buxferDB;
	console.log(BPC.logName+"getAllTagsLocal begin");
	//get local storage key
	buxferDB = localStorage.getItem(storageName);
	
    console.log(BPC.logName+"tags :"+buxferDB);
	if (buxferDB != null) {
	   
	   //transform the string as json object
	   return JSON.parse(buxferDB).tTags;
    }
	else {
        return null;
    }
    console.log(BPC.logName+"getAllTagsLocal end");
}


/*
* Implements setAllTags into localStorage
*/
BPC.setAllTagsLocal = function (storageName, allTags){
	var buxferDB, parsedBuxferDB, tags;
	console.log(BPC.logName+"setAllTagsLocal begin");
	//get local storage key
	buxferDB = localStorage.getItem(storageName);
	//db does not exist, then create
	if (buxferDB == undefined) {
		parsedBuxferDB = new Object();
	}else {
		//transform the string as json object
		parsedBuxferDB = JSON.parse(buxferDB);
	}
	 
	tags = parsedBuxferDB.tTags;
	console.log(BPC.logName+"tags :"+tags);
	
	if (tags == undefined) {
		tags = new Object();
	}
	tags = allTags;
	
	parsedBuxferDB.tTags = tags;
	
	localStorage.setItem(storageName, JSON.stringify(parsedBuxferDB));
	
	console.log(BPC.logName+"setAllTagsLocal end");
}