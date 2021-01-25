mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
  container: "map",
  zoom: 3.5,
  center: [-100, 41],
  style: "mapbox://styles/mapbox/light-v10"
});

map.addControl(new mapboxgl.NavigationControl());

// filters for classifying earthquakes into five categories based on magnitude
var mag1 = ["<", ["get", "mag"], 2];
var mag2 = ["all", [">=", ["get", "mag"], 2], ["<", ["get", "mag"], 3]];
var mag3 = ["all", [">=", ["get", "mag"], 3], ["<", ["get", "mag"], 4]];
var mag4 = ["all", [">=", ["get", "mag"], 4], ["<", ["get", "mag"], 5]];
var mag5 = [">=", ["get", "mag"], 5];

// colors to use for the categories
var colors = ["#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c"];

map.on("load", function() {
  // add a clustered GeoJSON source for a sample set of earthquakes
  map.addSource("campgrounds", {
    type: "geojson",
    data: campgrounds,
    cluster: true,
    clusterRadius: 80,
    clusterProperties: {
      // keep separate counts for each magnitude category in a cluster
      mag1: ["+", ["case", mag1, 1, 0]],
      mag2: ["+", ["case", mag2, 1, 0]],
      mag3: ["+", ["case", mag3, 1, 0]],
      mag4: ["+", ["case", mag4, 1, 0]],
      mag5: ["+", ["case", mag5, 1, 0]]
    }
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "campgrounds",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 7,
      "circle-stroke-color": "#11b4da"
    }
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "campgrounds",
    filter: ["has", "point_count"],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#00BCD4',
        10,
        '#2196F3',
        30,
        '#3F51B5'
    ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ],

    }
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "campgrounds",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12
    }
  });

  // circle and symbol layers for rendering individual earthquakes (unclustered points)

  // inspect a cluster on click
  map.on("click", "clusters", function(e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"]
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("campgrounds")
      .getClusterExpansionZoom(clusterId, function(err, zoom) {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom
        });
      });
  });

  map.on("click", "unclustered-point", function(e) {
    const text = e.features[0].properties.popUpMarkup;
    const coordinates = e.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    new mapboxgl.Popup({ offset: 15, openOnClick: true, anchor: "bottom" })
      .setLngLat(coordinates)
      .setHTML(
        text
        )
      .addTo(map);
  });

  map.on("mouseenter", "unclustered-point", function() {
    map.getCanvas().style.cursor = "pointer";
  });


  map.on("mouseleave", "unclustered-point", function() {
    map.getCanvas().style.cursor = "";
  });
});
