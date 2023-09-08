// Initialize the map
const myMap = L.map('map').setView([0, 0], 2);

// Create a tile layer for the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// URL of the GeoJSON data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

// Function to determine marker color based on earthquake depth
function markerColor(depth) {
    if (depth < 10) return "#00FF00"; // Green
    else if (depth < 30) return "#FFFF00"; // Yellow
    else if (depth < 50) return "#FFA500"; // Orange
    else return "#FF0000"; // Red
}

// Fetch the earthquake data and add markers to the map
fetch(url)
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;
            const magnitude = feature.properties.mag;
            const depth = coordinates[2];
            const location = feature.properties.place;

            // Create a circle marker for each earthquake
            const marker = L.circleMarker([coordinates[1], coordinates[0]], {
                radius: markerSize(magnitude),
                fillColor: markerColor(depth),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(myMap);

            // Add a popup with earthquake information
            marker.bindPopup(`<strong>Location:</strong> ${location}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`);
        });

        // Create a legend
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'info legend');
            const depths = [0, 10, 30, 50]; // Depth intervals
            const colors = ["#00FF00", "#FFFF00", "#FFA500", "#FF0000"]; // Corresponding colors

            for (let i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + colors[i] + '"></i> ' +
                    (depths[i] + (i + 1 < depths.length ? '&ndash;' + (depths[i + 1] - 1) + ' km<br>' : '+ km'));
            }
            return div;
        };

        legend.addTo(myMap);
    });
