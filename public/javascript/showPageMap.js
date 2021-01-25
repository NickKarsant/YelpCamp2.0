mapboxgl.accessToken = mapToken;    

var map = new mapboxgl.Map({
      container: 'show-map', // Specify the container ID
      style: 'mapbox://styles/mapbox/outdoors-v11', // Specify which map style to use
      center: campground.geometry.coordinates, // Specify the starting position [lng, lat]
      zoom: 8 // Specify the starting zoom
    });


  var popup = new mapboxgl.Popup({ offset: 30, openOnClick: true, anchor: 'bottom' }).setLngLat(campground.geometry.coordinates)
    .setHTML(`<h1>${campground.title}</h1><p>${campground.location}`)
    .addTo(map);

  var marker = new mapboxgl.Marker({ 'color': '#314ccd'})
    .setLngLat(campground.geometry.coordinates)
    .addTo(map); // add the marker to the map


    // Create variables for the latitude and longitude
var lng;
var lat;

var lngDisplay = document.getElementById('lng');
var latDisplay = document.getElementById('lat');
var eleDisplay = document.getElementById('ele');

map.on('click', function(e) {
  // When the map is clicked, set the lng and lat variables equal to the lng and lat properties in the returned lngLat object
  lng = e.lngLat.lng;
  lat = e.lngLat.lat;
  getElevation();
});


    function getElevation() {
  // Construct the API request
  var query = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/' + lng + ',' + lat + '.json?layers=contour&limit=50&access_token=' + mapboxgl.accessToken;
  $.ajax({
    method: 'GET',
    url: query,
  }).done(function(data) {
    // Display the longitude and latitude values
    lngDisplay.textContent = lng.toFixed(2);
    latDisplay.textContent = lat.toFixed(2);
    // Get all the returned features
    var allFeatures = data.features;
    // console.log(allFeatures);
    // Create an empty array to add elevation data to
    var elevations = [];
    // For each returned feature, add elevation data to the elevations array
    for (i = 0; i < allFeatures.length; i++) {
      elevations.push(allFeatures[i].properties.ele);
    }
    console.log(elevations);
    // In the elevations array, find the largest value
    var highestElevation = Math.max(...elevations);
    console.log("elevation: " + highestElevation);
    eleDisplay.textContent = highestElevation + 'm';
  });
}
