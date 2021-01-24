mapboxgl.accessToken = '<%-process.env.MAPBOX_TOKEN%>';

var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

var marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map); // add the marker to the map