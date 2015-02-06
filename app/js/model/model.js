/*******************BUXFER  MODEL*************************/
/* BuxferModel is an 'abstraction' of an installation of Buxfer Quick Client on a device. It can be used by all users contained in the users array. The currentUser property identifies the user which is using currently (as default) the app*/

function BuxferModel() {
    //contains the array of all users of the APP
    this.users = [];
    
    //contains the current user. (The user which at the moment is using the APP)
    this.currentUser = null;
    
    //contains the key reference tothe local storage to persist the current user
    this.currentUserKey = '1q2w3e4r_default_5t6y7u';
    
    //contains the sw version
    this.version = "1.0.0";
}
//set the current user
BuxferModel.prototype.setCurrentUser = function(aUser) {
    //TODO check: aUser must exists in users array. 
    
    this.currentUser = aUser;
};



//addUser the current user
BuxferModel.prototype.addUser = function(aUser) {
    var i;
    i = this.indexOfUsers (aUser.username);
    if (i == null) {
        this.users.push(aUser);
    } else {
    //username already exists
        //error
        throw new Error("username:"+aUser.username+" already exists!");
    }
};

//remove user basing on username parameter from the array
//if removed user is also the default user, set the next first user as default
BuxferModel.prototype.removeUser = function (username) {
    var i;
    i = this.indexOfUsers(username);
    if (i != null) {
        this.users.splice(i,1);
         //set current user
        if (username == this.currentUser.username) {
            if (this.users.length>0) {
                this.setCurrentUser(this.users[0]);
            }else {
                this.setCurrentUser(null);
            }
        }
    
    
    }
    
};

//find the first occurrence of username in users array.
//return the array index if username exists, null otherwise
BuxferModel.prototype.indexOfUsers = function (username) {
    
    for (var i = 0; i < this.users.length; i++){
        if (this.users[i].username == username){
            return i;
        }
        
    }
    return null;
}    

//************************ User *****************************
//User definition
function User(username) {
    this.username = username;
    this.password='******';
    this.savePassword=false;
    this.transactionList= []; //array of LocalTransaction 
    this.tagList= []; //array of LocalTag
    
    
}

User.prototype.addTransaction = function (aTransaction) {
    var id;

    //generate unique id combinig r+randomnumber between 1 to 100 + currenttime millisec
    //generate random number
    rand = Math.floor((Math.random()*100)+1);
    //generate unique id
    id = "r" + rand + (new Date()).valueOf();
    
    //assign id to the transaction
    aTransaction.id=id;
    this.transactionList.push(aTransaction);

};

//remove the the transaction from transactionList identified by transactionId
User.prototype.removeTransaction = function (transactionId) {
    var i;
    i= this.indexOfTransaction(transactionId);
    if (i != null) {
        this.transactionList.splice(i,1);
    }
    
};

//updates the transaction identified by transactionId (if exists) with the aTransaction
User.prototype.updateTransaction = function (aTransaction) {
	var i;
    i= this.indexOfTransaction(aTransaction.id);
    if (i != null) {
        this.transactionList[i]=aTransaction;
    }
     
};


//find the first occurrence of idtransaction in transactionList array.
//return the array index if transactionid exists, null otherwise
User.prototype.indexOfTransaction = function (transactionId) {
    for (var i = 0; i < this.transactionList.length; i++){
        if (this.transactionList[i].id == transactionId){
            return i;
        }
        
    }
    return null;

}

//************************ LocalTag ************************
//LocalTag definition
function LocalTag(tagname) {
    this.tagname= tagname;
}



//************************ LocalTransaction ****************
//LocalTransaction definition
function LocalTransaction () {
    this.id='';
    this.description='';
    this.status='created';//created, saved, sending, error
    this.date='';
    this.amount=0;
    this.type='expense'; //or income
    this.tags='';
}
//************************BuxferResult*********************
function BuxferResult () {
    this.status='init';
    this.value='init';
    this.msg='init';
}