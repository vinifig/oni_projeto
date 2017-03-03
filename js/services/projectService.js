$(document).ready(function(){
  const ProjectService = {};
  const projectKey = 'user';

  const projectFieldsHash = {
    'project_name': 'name',
    'date': 'date',
    'hour': 'hour',
    'lat': 'lat',
    'lng': 'lng',
    'descricao': 'description'
  }

  ProjectService.insert = function(projectData){
    return new Promise((resolve, reject)=>{
      DBService.insert(projectKey, projectData.name, projectData)
        .then(resolve)
        .catch(reject)
    });
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
      project[projectFieldsHash[field.name]] = field.value;
    }
    return project;
  }

  window.ProjectService = ProjectService;
})
