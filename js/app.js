/*global mapboxgl*/
/*global turf*/

window.addEventListener('DOMContentLoaded', () => {
  console.log('JS loaded');

  //************************ VARIABLES *****************************************
  //geolocate user if possible - By default set in London
  const latitude = -0.181719;
  const longitude = 51.519739;
  let locationsArr = [];
  const maxLocations = 9; //including home as starting point
  let startEndPoint = null;
  let bestRouteArr = [];
  let shortestDist = null;

  //************************************** Class Map ***************************
  class Map {

    constructor(){
      const markers = [];

      //set token on map
      mapboxgl.accessToken = 'pk.eyJ1IjoiZmFhYmtlIiwiYSI6ImNqaHVsMTJvcTBsb2UzcnM3Y3oxbTlmdHQifQ.YPZQk8EmRpMWrtssf733bQ';

      //define map object
      const map = new mapboxgl.Map({
        container: 'map', //id of container
        style: 'mapbox://styles/faabke/cjhul1zge0vof2sk24i14174u',
        zoom: 13, // starting zoom
        center: [latitude, longitude]
      });

      //disable double click on map as double click should add icons
      //single click is used to move the map
      map.doubleClickZoom.disable();

      // Add zoom and rotation controls to the map.
      map.addControl(new mapboxgl.NavigationControl());

      //******************* Add location event *********************************

      //enables user to click on location to add a marker - 8 locations max + home
      map.on('dblclick', function(e) {
        if(locationsArr.length < maxLocations){
          //define marker with DOM element (div)
          var elt = document.createElement('div');
          elt.className = 'marker'; //in order to style it
          //Add house icon if first marker, otherwise pin icon
          elt.innerHTML = locationsArr.length === 0 ? '<i class="fas fa-home fa-2x"></i>' : '<i class="fas fa-thumbtack fa-2x"></i>';
          //add marker to map
          markers.push(new mapboxgl.Marker(elt)
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .addTo(map));
          //add the new location to the array of locations. It includes the starting point (home)
          locationsArr.push([e.lngLat.lng, e.lngLat.lat]);
        } else {
          window.alert('You can add a maximum of 8 destinations for your journey');
        }
      });

      this.markers = markers;
      this.map = map;
    }

    // *********************** drawBestRoute ***********************************
    drawBestRoute(){
      //remove previous layer in case user keeps adding new points
      //still gets error message despite catch err...
      try {
        this.map.removeLayer('route');
        this.map.removeSource('route');
      } catch (err){
        // nothing
      }
      // try {map.removeSource('route')} catch (err);
      this.map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": bestRouteArr
                }
            }
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#ff0066",
            "line-width": 4
        }
      });
    }

    // *********************** Reset *******************************************
    destroy() {
      //remove the markers
      this.markers.forEach(marker => marker.remove());
      //re-initialise global variables - not great practice...
      locationsArr = [];
      startEndPoint = null;
      bestRouteArr = [];
      shortestDist = null;
      document.querySelector('.distance').innerHTML = '';
      //this.map = null;  //do not delete instance of map as can not draw on it anymore so keep the same instance all the time
      //remove the route
      try {
        this.map.removeLayer('route');
        this.map.removeSource('route');
      } catch (err){
        // nothing
      }
    }

  }

  //*********************** create map instance ********************************

  const map = new Map();

  //****** Add event listener to button to calculate optimal route and reset ***

  document.querySelector('.calcIt').onclick = calculate;
  document.querySelector('.reset').onclick = map.destroy.bind(map);


  // *********************** calculate Itinerary *******************************
  function calculate() {
    switch(locationsArr.length){
      case 0:
        window.alert('You need at least 2 locations in your itinerary');
        break;
      case 1:
        window.alert('You need at least another location in your itinerary');
        break;
      default:
        calculateItinerary(locationsArr);
    }
  }

  //************function to calculate distance between 2 points*****************
  function calculateDist(pointA, pointB){
    const from = turf.point(pointA);
    const to = turf.point(pointB);
    const options = {units: 'kilometers'};
    return turf.distance(from, to, options);
  }


  //*********function to calculate the total distance of an itinerary***********
  function calculateTotalDist(itineraryArr){
    //initialise with distance from last point back home
    let totalDist = calculateDist(itineraryArr[itineraryArr.length - 1], itineraryArr[0]);
    //loop through the different points
    for(let i = 1; i < itineraryArr.length; i++){
      totalDist += calculateDist(itineraryArr[i - 1], itineraryArr[i]);
    }
    return totalDist;
  }


  //**************function that returns an array with all permutations**********
  //(not including starting point and endpoint)
  function CalcPermutations(itinerary){
    const permutations = [];

    if (itinerary.length === 1) {
      return itinerary;
    }

    for (let i = 0; i < itinerary.length; i++) {
      const firstPoint = itinerary[i];
      //all the other points on itinerary
      const pointsLeft = itinerary.slice(0, i).concat(itinerary.slice(i + 1));
      //recursive call on the points left in the itinerary
      const innerPermutations = CalcPermutations(pointsLeft);
      for (let j = 0; j < innerPermutations.length; j++) {
        //innerPermutations can be an array with one or several arrays of coordinates [ [[lng, lat], [lng, lat]] ], ...,  ...] hence the test below.
        innerPermutations.length > 1 ?
          permutations.push([firstPoint, ...innerPermutations[j]]) : permutations.push([firstPoint, innerPermutations[j]]);
      }
    }
    return permutations;
  }

  //**************function to calculate optimal itinerary***********************
  function calculateItinerary(itinerary){

    //get starting point from itinerary
    startEndPoint = itinerary[0];

    //intialise all itineraries, best route array and shortest distance
    const itinerariesArr = CalcPermutations(itinerary.slice(1)); //returns an array of arrays of all itineraries without start and end point
    console.log('Nb of permutations !(n - 1)', itinerariesArr.length);
    //Define initial best route as one of the permutation with the start and end point
    bestRouteArr = itinerariesArr.length > 1 ? [startEndPoint, ...itinerariesArr[0], startEndPoint] : [startEndPoint, itinerariesArr[0], startEndPoint];

    shortestDist = calculateTotalDist(bestRouteArr);

    //if the itinerary has a total distance smaller than the current shortest distance
    itinerariesArr.forEach(itin => {
      const currentRoute = itin[0].length > 1 ? [startEndPoint, ...itin, startEndPoint] : [startEndPoint, itin, startEndPoint];
      const currentTotalDist = calculateTotalDist(currentRoute);
      if (currentTotalDist < shortestDist){
        bestRouteArr = currentRoute.slice();
        shortestDist = currentTotalDist;
      }
    });

    //once best itinerary is found draw it on the map and update the distance displayed
    map.drawBestRoute();
    document.querySelector('.distance').innerHTML = `The shortest route will be <span> ${Math.round(shortestDist*100)/100} km </span> long`;
  }

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
