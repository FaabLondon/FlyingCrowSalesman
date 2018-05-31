window.addEventListener('DOMContentLoaded', () => {
  console.log('JS loaded');

  //geolocate user if possible - By default set in London
  let latitude = 0.1278;
  let longitude = 51.5074;

  //Geolocation does not work...
  function geoSuccess(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  }
  navigator.geolocation.watchPosition(geoSuccess);

  //set token on map
  mapboxgl.accessToken = 'pk.eyJ1IjoiZmFhYmtlIiwiYSI6ImNqaHVsMTJvcTBsb2UzcnM3Y3oxbTlmdHQifQ.YPZQk8EmRpMWrtssf733bQ';

  //define map object
  const map = new mapboxgl.Map({
    container: 'map', //id of container
    style: 'mapbox://styles/faabke/cjhul1zge0vof2sk24i14174u',
    zoom: 9, // starting zoom
    center: [latitude, longitude]
  });

  //add user on the map - does not work for now despite adding showUserLocation
  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false,
      timeout: 6000
    },
    trackUserLocation: false,
    showUserLocation: true
  }));

  map.on('mousedown', function(e) {
    let marker = new mapboxgl.Marker()
      .setLngLat([e.lngLat.lng, e.lngLat.lat])
      .addTo(map);
  });

});
