$(document).ready(function(){
  const db = new PouchDB('danitcc');
  const remote = new PouchDB('http://localhost:5984/danitcc');
  const separator = '$';
  db.sync(remote);

  const DBService = {}

  DBService.find = function(type, id){
    return new Promise((resolve, reject)=>{
      db.get(type + separator + id)
        .then((doc) => {
          resolve(doc);
        })
        .catch((err) => {
          reject(err);
        })
    })
  }

  DBService.insert = function(type, id, data){
    return new Promise((resolve, reject)=>{
      data._id = type + separator + id;
      db.put(data)
        .then((doc) => {
          resolve(doc);
        })
        .catch((err) => {
          reject(err);
        })
    })
  }

  DBService.remove = function(type, id){
    return new Promise((resolve, reject)=>{
      db.get(type + separator + id)
        .then((doc) => {
          db.remove(doc)
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              reject(err);
            })
        })
        .catch((err) => {
          reject(err);
        })
    })
  }

  window.DBService = DBService;
})
