mapboxgl.accessToken = window.mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: window.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

console.log("Window co-ordinates:", window.coordinates)

const marker = new mapboxgl.Marker({
    color: 'red',
    draggable: true
    }).setLngLat(window.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.location}</h4><p><b>Extact Location Will Be Provided After Booking</b> </p>`)
    .setMaxWidth("500px"))
    .addTo(map); 






























