// Initialize the map
var map = L.map('map').setView([34, 0], 2);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Use d3 to retrieve GeoJson data
var data = d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson').then(function(data) {


    // Function to style markers based on depth
    function depthColor(quakeDepth) {
        if (quakeDepth <= 10) {
            return '#7DDA58'; // Green for depth 10
        } else if (quakeDepth <= 30) {
            return '#BFD641'; // Light Green for depth 10-30
        } else if (quakeDepth <= 50) {
            return '#FFDE59'; // Yellow for depth 30-50
        } else if (quakeDepth <= 70) {
            return '#FDB74B'; // Light Orange for depth 50-70
        } else if (quakeDepth < 90) {
            return '#FE9900'; // Orange for depth 70-90
        } else {
            return '#E4080A'; // Red for depth 90+
        }
    }

    // Create a GeoJSON layer
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 3,
                fillColor: depthColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br />" +
                "Depth: " + feature.geometry.coordinates[2] + "km");
        }
    }).addTo(map);    


    
    // Create a legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var depthRanges = [0, 10, 30, 50, 70, 90, 100];
        var colors = depthColor
        var labels = [];

        // Loop through depth ranges and generate a label with a colored square
        for (var i = 0; i < depthRanges.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors(depthRanges[i] + 1) + '"></i> ' +
                depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + ' km<br>' : '+ km');
        }

        return div;

    };

    // Add the legend to the map
    legend.addTo(map);
});
















    








