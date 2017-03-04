function register(user){
  UserService.register(user)
    .then(console.log.bind())
    .catch(console.log.bind());
}

function login(user){
  UserService.login(user)
    .then(function(result){
      location.href="app.html"
    })
    .catch(function(err){
      alert("Usuário ou senha incorretos");
    });
}

$(document).ready(function(){
  $("#form").submit(function(e){
    e.preventDefault();
    let formData = $(this).serializeArray();
    let user = UserService.arrayParser(formData);
    if(user.contact){
      register(user);
    }else{
      login(user);
    }
  })
  UserService.getUserLoggedIn()
    .then(function(user){
      if(user.name)
        location.href="app.html"
    })
    .catch(function(){
      // faz nada
    })
})
