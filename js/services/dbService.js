$(document).ready(function(){
  const db = new PouchDB('danitcc');
  const remote = new PouchDB('http://oniprojeto.com.br/couchdb/danitcc');
  const separator = '$';
  db.sync(remote);

  const DBService = {}

  DBService.find = function(type, id){
    db.sync(remote);
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
      data.type = type;
      db.put(data)
        .then((doc) => {
          db.sync(remote);
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
              db.sync(remote);
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

  DBService.getAllByType = function(type){
    db.sync(remote);
    return new Promise((resolve, reject)=>{
      db.query((doc, emit) => {
        emit(doc.type);
      }, {key: type, include_docs: true})
        .then((documents) => {
          resolve(documents.rows);
        })
        .catch((err) => {
          reject(err);
        })
    });
  }

  window.DBService = DBService;
})
