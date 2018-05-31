window.addEventListener('DOMContentLoaded', () => {
  console.log('JS loaded');

  //************************ VARIABLES ***********************************//
  //geolocate user if possible - By default set in London
  let latitude = 0.1278;
  let longitude = 51.5074;
  let nbLocations = 0;
  const maxLocations = 9; //including home as starting point

  //************************ MAP SETUP ************************************//
  //set token on map
  mapboxgl.accessToken = 'pk.eyJ1IjoiZmFhYmtlIiwiYSI6ImNqaHVsMTJvcTBsb2UzcnM3Y3oxbTlmdHQifQ.YPZQk8EmRpMWrtssf733bQ';

  //define map object
  const map = new mapboxgl.Map({
    container: 'map', //id of container
    style: 'mapbox://styles/faabke/cjhul1zge0vof2sk24i14174u',
    zoom: 9, // starting zoom
    center: [latitude, longitude]
  });

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());

  //enables user to click on location to add a marker - 8 locations max + home
  map.on('mousedown', function(e) {
    if(nbLocations < maxLocations){
      //define marker with DOM element (div)
      var elt = document.createElement('div');
      elt.className = 'marker'; //in order to style it
      //Add house icon if first marker, otherwise pin icon
      elt.innerHTML = nbLocations === 0 ? '<i class="fas fa-home fa-2x"></i>' : '<i class="fas fa-thumbtack fa-2x"></i>';
      //add marker to map
      let marker = new mapboxgl.Marker(elt)
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map);
      nbLocations++;
    } else {
      window.alert('You can add a maximum of 8 destinations for your journey');
    }
  });

});



//Geolocation does not work...
// function geoSuccess(position) {
//   latitude = position.coords.latitude;
//   longitude = position.coords.longitude;
// }
// navigator.geolocation.watchPosition(geoSuccess);



//add user on the map - does not work for now despite adding showUserLocation
//Due to geolocation blocked
// map.addControl(new mapboxgl.GeolocateControl({
//   positionOptions: {
//     enableHighAccuracy: false,
//     timeout: 6000
//   },
//   trackUserLocation: false,
//   showUserLocation: true
// }));
