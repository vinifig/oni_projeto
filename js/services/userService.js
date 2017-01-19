$(document).ready(function(){
  const UserService = {};
  const userKey = 'user';

  UserService.register = function(userData){
    return new Promise((resolve, reject)=>{
      // DBService.insert(userKey, userData)
        // .then()
    })
  }

  window.UserService = UserService;
})
