$(document).ready(function(){
  const ProjectService = {};
  const projectKey = 'project';

  const projectFieldsHash = {
    'project_name': 'name',
    'date': 'date',
    'hour': 'hour',
    'local': 'local',
    'lat': 'lat',
    'lng': 'lng',
    'descricao': 'description'
  }

  ProjectService.insert = function(projectData, projectId){
    return new Promise((resolve, reject)=>{
      let insert;
      if(projectId !== undefined){
        insert = DBService.insert(projectData, projectId);
      }else {
        insert = DBService.insert(projectData, projectKey, projectData.name)
      }
      insert.then(resolve).catch(reject)
    });
  }

  ProjectService.find = function(projectId){
    return new Promise((resolve, reject)=>{
      DBService.find(projectId)
        .then(resolve)
        .catch(reject);
    });
  }

  ProjectService.subscribe = function(projectId){
    return new Promise((resolve, reject)=>{
      ProjectService.find(projectId)
        .then((project)=>{
          UserService.getUserLoggedIn()
            .then((user)=>{
              if(project.users == undefined){
                project.users = [];
              }
              let filtered = project.users.filter((puser)=>puser.name == user.name);
              if(filtered.length == 0){
                project.users.push(user);
              }
              ProjectService.insert(project, projectId);
            })
            .catch(reject);
        })
        .catch(reject);
    })
  }

  ProjectService.getAll = function(){
    return new Promise((resolve, reject)=>{
      DBService.getAllByType(projectKey)
        .then(function(data){
          resolve(data.map(item => item.doc));
        })
        .catch(reject);
    })
  }

  ProjectService.arrayParser = function(arr){
    let project = {};
    for(let field of arr){
      console.log(field)
      project[projectFieldsHash[field.name]] = field.value;
    }
    return project;
  }

  window.ProjectService = ProjectService;
})
