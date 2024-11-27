function displayMapWithMapbox(contour) {
    // Initialiser la carte Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXBoZW9uaXgiLCJhIjoiY2xybnRvYWpiMDIwZDJrbmpnbWJ0cmxxcyJ9.6TTooAkA_PtvHQvZi2cgQQ'; // Remplacez par votre clé
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/apheonix/cm3zyek2100pd01sdae2q66ce',
        center: [contour[0][0][0], contour[0][0][1]],
        zoom: 10, // Zoom initial
    });

    // Ajouter un contrôle de zoom et de rotation
    map.addControl(new mapboxgl.NavigationControl());

    // Créer un GeoJSON pour afficher le contour de la ville
    const geoJson = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: contour,
        },
    };

    // Chargement de la carte
    map.on('load', () => {
        map.addSource('cityContour', {
            type: 'geojson',
            data: geoJson,
        });

        map.addLayer({
            id: 'cityContourLayer',
            type: 'fill',
            source: 'cityContour',
            layout: {},
            paint: {
                'fill-color': '#888888',
                'fill-opacity': 0.5,
            },
        });

        // Ajouter une bordure autour du contour
        map.addLayer({
            id: 'cityContourBorder',
            type: 'line',
            source: 'cityContour',
            layout: {},
            paint: {
                'line-color': 'red',
                'line-width': 2,
            },
        });
    });
}
