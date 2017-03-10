var initial_tab = 'novo';
let markers = [];
let geocoder = new google.maps.Geocoder;
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
  <div id="${doc._id.split('$')[1]}" class="col s12">
    <div class="card horizontal blue-grey darken-1">
      <div class="card-stacked">
        <div class="card-content">
          <span class="card-title">${doc.name}</span>
          <p>${doc.description}</p>
          <p>Data: ${doc.date}</p>
          <p>Hora: ${doc.hour}</p>
          <p>Local: ${doc.local}</p>
          <p>Contato: ${doc.user.contact}</p>
        </div>
        <div class="card-inscritos card-action">
          <span class="card-title">${doc.users.length} Inscrito${doc.users.length > 1 ? 's' : ''}:</span>
          <a class="listar-button" _id="${doc._id}" href="#"><span class="show">[+]</span><span>[-]</span></a>`;
  for(let iuser of doc.users){
    base += `<p class="lista-inscritos">${iuser.name}</p>`;
  }
  base += `</div>
        <div class="card-action">
          <a class="ver-button" lat="${doc.lat}" lng="${doc.lng}" href="#">Ver</a>`;
  try{
    let filtered = doc.users.filter((puser)=>puser.name == user.name);
    if(filtered.length !== 0){
      base += `<a class="desinscrever-button" _id="${doc._id}" href="#">Inscrito</a>`
    }else{
      base += `<a class="inscrever-button" _id="${doc._id}" href="#">Inscrever-se</a>`;
    }
  }
  catch(e){
    base += `<a class="inscrever-button" _id="${doc._id}" href="#">Inscrever-se</a>`;
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
          let _id = $(this).attr('_id');
          ProjectService.subscribe(_id);
          updateData();
        })
        $('.listar-button').click(function(){
          let _id = $(this).attr('_id').split('$')[1];
          $(`#${_id} a.listar-button span`).toggleClass('show');
          $(`#${_id} .lista-inscritos`).toggleClass('show');
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
        geocoder.geocode({
          address: projectData.local
        }, function(local, status){
          if(status == google.maps.GeocoderStatus.OK){
            projectData.lat = local[0].geometry.location.lat();
            projectData.lng = local[0].geometry.location.lng();
          }
          projectData.user = user;
          ProjectService.insert(projectData)
            .then(function(result){
              updateData()
            })
            .catch(function(error){
              console.log(error);
            })
          $('#novo-tab').trigger('reset');
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
