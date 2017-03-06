$(document).ready(function(){
  const UserService = {};
  const userKey = 'user';

  const UserFieldsHash = {
    'name': 'name',
    'password': 'password',
    'contato': 'contact'
  }



  UserService.register = function(userData){
    return new Promise((resolve, reject)=>{
      DBService.insert(userData, userKey, userData.name)
        .then(resolve)
        .catch(reject);
    });
  }

  UserService.login = function(userData){
    return new Promise((resolve, reject)=>{
      DBService.find(userKey, userData.name)
        .then(function(user){
          if(user.password === userData.password){
            return resolve(setUserLoggedIn(user));
          }
          reject('user-not-found')
        })
        .catch(reject)
    });
  }

  UserService.edit = function(userData){
    return new Promise((resolve, reject)=>{

    });
  }

  function setUserLoggedIn(userData){
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  }

  UserService.getUserLoggedIn = function(){
    return new Promise((resolve, reject)=>{
      let user = JSON.parse(localStorage.getItem('user'));
      resolve(user);
    })
  }

  UserService.arrayParser = function(arr){
    let project = {};
    for(let field of arr){
      project[UserFieldsHash[field.name]] = field.value;
    }
    return project;
  }

  UserService.logout = function(){
    localStorage.removeItem('user');
    location.href="index.html";
  }

  window.UserService = UserService;
})
