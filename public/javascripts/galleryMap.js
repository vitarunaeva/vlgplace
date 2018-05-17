
// function CustomMarker(latlng, map, imageSrc) {
//     this.latlng_ = latlng;
//     this.imageSrc = imageSrc;
//     // Once the LatLng and text are set, add the overlay to the map.  This will
//     // trigger a call to panes_changed which should in turn call draw.
//     this.setMap(map);
// }
//
// CustomMarker.prototype = new google.maps.OverlayView();
// CustomMarker.prototype.draw = function () {
//     // Check if the div has been created.
//     var div = this.div_;
//     if (!div) {
//         // Create a overlay text DIV
//         div = this.div_ = document.createElement('div');
//         // Create the DIV representing our CustomMarker
//         div.className = "customMarker";
//
//
//         var img = document.createElement("img");
//         img.src = this.imageSrc;
//         div.appendChild(img);
//         google.maps.event.addDomListener(div, "click",
//             function (event) {
//                 google.maps.event.trigger(me, "click");
//             });
//
//         // Then add the overlay to the DOM
//         var panes = this.getPanes();
//         panes.overlayImage.appendChild(div);
//     }
// // Position the overlay
//     var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
//     if (point) {
//         div.style.left = point.x + 'px';
//         div.style.top = point.y + 'px';
//     }
// };
//
// CustomMarker.prototype.remove = function () {
//     // Check if the overlay was on the map and needs to be removed.
//     if (this.div_) {
//         this.div_.parentNode.removeChild(this.div_);
//         this.div_ = null;
//     }
// };
//
// CustomMarker.prototype.getPosition = function () {
//     return this.latlng_;
// };
// var map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 17,
//     center: new google.maps.LatLng(48.42216, 44.31308),
//     mapTypeId: google.maps.MapTypeId.ROADMAP
// });
//
// var data = [{
//    profileImage: newPhoto,
//    pos: [latitude, longitude]
// }];
//
// // var data = [{
// //     profileImage: "./images/1.jpg",
// //     pos: [48.42217, 44.31308]
// // }, {
// //     profileImage: "./images/2.jpg",
// //     pos: [48.42220, 44.31308]
// // }];

//
// for(var i=0;i<data.length;i++){
//     new CustomMarker(new google.maps.LatLng(data[i].pos[0],data[i].pos[1]), map,  data[i].profileImage)
// }


// function initMap() {
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 17,
//         center: {lat: 48.42216, long: 44.31308}
//     });
//
//     var photoGPS = {
//         //ToDO задать foreach
//         //перебрать все фотографии
//
//     };
//
//     var marker = new google.maps.Marker({
//         position: map.getCenter(),
//         icon: photoGPS,
//         map: map
//     });
// }

// function initMap() {
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 4,
//         center: {lat: 48.42216, lng: 44.31308}
//     });
//
//     setMarkers(map);
//     // var photoGPS = {
//     //
//     // };
//     //
//     // var marker = new google.maps.Marker({
//     //     position: map.getCenter(),
//     //     icon: photoGPS,
//     //     map: map
//     // });
// }
//
// var GPScoordinates = []; //задаются геоданные для маркеров
//
// //добавление маркеров на карту
// function setMarkers(map) {
//     var image = {
//         photo: filePhoto, //в качестве маркера - загружаемая пользователем фотография
//         size: new google.maps.Size(20,32),
//         origin: new google.maps.Point(0,0)
//     };
//
//     //определение зоны клика
//     var shape = {
//         coords: [1, 1, 1, 20, 18, 20, 18, 1],
//         type: 'poly'
//     };
//
//     for (var i=0; i<GPScoordinates.length; i++){
//         var  gpscoord = GPScoordinates[i];
//         var marker = new google.maps.Marker({
//             position: {lat: gpscoord[1], lng: gpscoord[2]},
//             map: map,
//             icon: image,
//             shape: shape,
//             title: gpscoord[0],
//             zIndex: gpscoord[3]
//         });
//
//     }
// }