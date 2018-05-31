window.addEventListener('DOMContentLoaded', () => {
  console.log('JS loaded');

  //set token on map
  mapboxgl.accessToken = 'pk.eyJ1IjoiZmFhYmtlIiwiYSI6ImNqaHVsMTJvcTBsb2UzcnM3Y3oxbTlmdHQifQ.YPZQk8EmRpMWrtssf733bQ';

  //geolocate user if possible - By default set in London
  let latitude = 0.1278;
  let longitude = 51.5074;

  function geoSuccess(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  }
  navigator.geolocation.watchPosition(geoSuccess);

  //define map object
  const map = new mapboxgl.Map({
    container: 'map', //id of container
    style: 'mapbox://styles/faabke/cjhul1zge0vof2sk24i14174u',
    zoom: 9, // starting zoom
    center: [latitude, longitude]
  });



});
