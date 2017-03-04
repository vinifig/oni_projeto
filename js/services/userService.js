$(document).ready(function(){
  const UserService = {};
  const userKey = 'user';

  UserService.register = function(userData){
    return new Promise((resolve, reject)=>{
      DBService.insert(userKey, userData.name, userData)
        .then(resolve)
        .catch(reject);
    });
  }

  UserService.login = function(userData){
    return new Promise((resolve, reject)=>{
      // DBService.get(userKey, userData)
        // .then(processaSenha)
        // resolve(userData);
    });
  }

  UserService.edit = function(userData){
    return new Promise((resolve, reject)=>{

    });
  }

  function setUserLogin(userData){

  }

  UserService.getUserLoggedIn = function(){
    return new Promise((resolve, reject)=>{
      let user = JSON.parse(localStorage.getItem('user'));
      resolve(user)
    })
  }

  window.UserService = UserService;
})
