"use strict";

import { locService } from './loc-service.js'

export const mapService = {
  initMap,
  addMarker,
  panTo,
  searchByTxt,
};

var gMap;

// init map on load
function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log("InitMap");
  return _connectGoogleApi().then(() => {
    console.log("google available");
    gMap = new google.maps.Map(document.querySelector("#map"), {
      center: { lat, lng },
      zoom: 15,
    });
    console.log("Map!", gMap);
  });
}

function searchByTxt(address) {
//   var address = "rehovot israel";
  var addressByFormat = address.split(" ").join("+");
  const API_GEO_KEY = `AIzaSyCzES929Y16KCfbjb0oIc09xQYNU9FxTSM`;
  const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressByFormat}&key=${API_GEO_KEY}`;
  console.log(geoUrl);
  const prm = axios
    .get(geoUrl)
    .then((res) => {
      var pos = res.data.results[0].geometry.location
      console.log(res.data.results[0].geometry.location);
      locService.addSaveLoc(address, pos.lat, pos.lng)
      return pos
    })
    .catch((err) => {
      console.log(err, "oops");
    });
  return prm;
}

// adds marker according to chosen loc
function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    // title: "Hello World!",
  });
  return marker;
}

// function removeMarker()

// shows new loc on map
function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
}

// inner func that upload map for first
// WHY: window.google??
function _connectGoogleApi() {
  const API_KEY = "AIzaSyAJfCM2o8DvIAvQdLQcfjKiQpUYOdm0vO0";
  if (window.google) return Promise.resolve();
  var elGoogleApi = document.createElement("script");
  // console.log(elGoogleApi);
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject("Google script failed to load");
  });
}
