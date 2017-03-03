$(document).ready(function(){
  const UserService = {};
  const userKey = 'user';

  UserService.register = function(userData){
    return new Promise((resolve, reject)=>{
      DBService.insert(userKey, userData.name, userData)
        .then(function(){
          
        })
        .catch(function(){
        })
    });
  }

  UserService.login = function(userData){
    return new Promise((resolve, reject)=>{
      // DBService.get(userKey, userData)
        // .then(processaSenha)
      resolve(userData);
    });
  }

  UserService.edit = function(userData){
    return new Promise((resolve, reject)=>{

    });
  }

  window.UserService = UserService;
})
