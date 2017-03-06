var initial_tab = 'todos';
let markers = [];
let guser;
function start(){
  updateData();
  setInterval(updateData, 2 * 60 * 1000);

  UserService.getUserLoggedIn()
    .then(function(user){
      guser = user;
      $("#username").text(user.name);
    })
    .catch(function(err){
      location.href = 'login.html'
    })
}


function addMarker(lat, lng) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map
  });
  markers.push(marker);
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
}

function showMarkers() {
  setMapOnAll(map);
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function centerMap(lat, lng, zoom){
  let coordinates = new google.maps.LatLng(lat, lng)
  map.setCenter(coordinates);
  if(zoom != undefined){
    map.setZoom(zoom);
  }
}

function inflateDocument(doc, user){
  doc.users = doc.users || [];
  let base = `
  <div class="col s12">
    <div class="card horizontal blue-grey darken-1">
      <div class="card-stacked">
        <div class="card-content">
          <span class="card-title">${doc.name}</span>
          <p>${doc.description}</p>
          <p>Data: ${doc.date}</p>
          <p>Hora: ${doc.hour}</p>
          <p>Contato: ${doc.user.contact}</p>
          <p>${doc.users.length} inscrito${doc.users.length > 1 ? 's' : ''}</p>
        </div>
        <div class="card-action">
          <a class="ver-button" lat="${doc.lat}" lng="${doc.lng}" href="#">Ver</a>`;
  try{
    let filtered = doc.users.filter((puser)=>puser.name == user.name);
    if(filtered !== 0){
      base += `<a disabled id="${doc._id}" href="#">Inscrito</a>`
    }else{
      base += `<a class="inscrever-button" id="${doc._id}" href="#">Inscrever-se</a>`;
    }
  }
  catch(e){
    base += `<a class="inscrever-button" id="${doc._id}" href="#">Inscrever-se</a>`;
  }
  base += `
        </div>
      </div>
    </div>
  </div>
  `
  return base;
}

function updateData(){
  ProjectService.getAll()
    .then((docs)=>{
        $('#todos-tab').empty();
        for(let doc of docs){
          $('#todos-tab').prepend(inflateDocument(doc, guser));
          addMarker(doc.lat, doc.lng);
        }
        $('.ver-button').click(function(){
          let lat = $(this).attr('lat');
          let lng = $(this).attr('lng');
          centerMap(lat, lng, 12);
        })
        $('.inscrever-button').click(function(){
          let _id = $(this).attr('id');
          ProjectService.subscribe(_id);
        })
      // if()
    })
    .catch((err)=>{
      throw new Error(err);
    })
}

function selectTab(name){
  $('.select-button').removeClass('selected');
  $('.paneltab').removeClass('active');
  $('#'+name+'-button').addClass('selected');
  $('#'+name+'-tab').addClass('active');
}

$(document).ready(function(){
  $('#novo-tab').submit(function(e){
    e.preventDefault();
    var projectData = ProjectService.arrayParser($(this).serializeArray());
    UserService.getUserLoggedIn()
      .then(function(user){
        projectData.user = user;
        ProjectService.insert(projectData)
        .then(function(result){
          updateData()
        })
        .catch(function(error){
          console.log(error);
        })
      })
      .catch(function(err){
        console.log(err);
      })
  });

  $('.select-button').click(function(){
    var name = $(this).attr('id').split('-')[0];
    selectTab(name);
  });

  $('#logout').click(UserService.logout);

  start();
})

$(document).ready(function(){
  selectTab(initial_tab);
})
