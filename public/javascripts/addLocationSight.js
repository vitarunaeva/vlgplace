var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('locationSight'),{
        zoom: 10,
        center: new google.maps.LatLng(48.42216, 44.31308)
    });

    map.addListener('click', function(e) {
        placeMarker(e.latLng, map);
    });

    function placeMarker(position, map) {
        var marker = new google.maps.Marker({
            position: position,
            map: map
        });
        map.panTo(position);
    }
}