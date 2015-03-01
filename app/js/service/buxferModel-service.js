/***************************SERVICE USERS MODEL*********************************************/
/*Create a global users model used to:
/* - sharing data between controllers
/* - retrieving users from local storage
/* - saving user to the local storage */

buxferModule.service('ServiceBuxferModel', function() {
    
    this.serviceName = 'ServiceBuxferModel';
    //defining a new empty instance of buxfer model
    this.buxferModel = new BuxferModel();
    
    //refresh the buxfer model reading the local storage
    this.fetchFromLocalStorage = function() {
        console.log(this.serviceName+".fetchFromLocalStorage() begin");
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
                user.encryptedPassword = userObject.encryptedPassword;
                
                //decrypting password and put value to clear password
                var decryptedPwd = CryptoJS.AES.decrypt(user.encryptedPassword, this.buxferModel.currentUserKey);
                user.clearPassword = decryptedPwd.toString(CryptoJS.enc.Utf8);
                
                user.savePassword = userObject.savePassword;
				user.defaultDescription = userObject.defaultDescription;
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
        console.log(this.serviceName+".fetchFromLocalStorage() end");
    };
    
    //this.refresh();
        
    //save the user using username as a key
    this.saveUser = function(aUser) {
        var userString, transactionString;
        console.log(this.serviceName + ".saveUser() begin");
        
        //change the encrypted password ecnrypting the clear password
        //provides by the user
        var encryptedPwd = CryptoJS.AES.encrypt(aUser.clearPassword, this.buxferModel.currentUserKey);
        aUser.encryptedPassword = encryptedPwd.toString();
        //....then cleans clearPassword prior to save the user
        aUser.clearPassword="*********";
        
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

    