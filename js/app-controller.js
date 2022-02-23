"use strict";

import { mapService } from "./services/map-service.js";
import { locService } from "./services/loc-service.js";
import { weatherService } from "./services/weather-service.js";

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;
window.onDeleteLoc = onDeleteLoc;
window.onCopyLoc = onCopyLoc;

//TODO: add marker on saved from storage 
// TODO: delete
// TODO: add onPanTo to show on map - on users location

var gCurrLocIdx = -1;

// render map
function onInit() {
  mapService
    .initMap()
    .then(() => {
      renderLoc();
    })
    .catch(() => console.log("Error: cannot init map"));
}

// on user search show on map, add marker, save location
function onSearch(ev) {
  ev.preventDefault();
  const inputVal = document.querySelector("input[type=search]").value;
  mapService
    .searchByTxt(inputVal)
    .then((pos) => {
      // mapService.addMarker(pos)
      onAddMarker(pos);
      mapService.panTo(pos.lat, pos.lng);
      var currName = locService.formatAdderss(inputVal);
      _renderCurrLocName(currName);
      renderLoc();
    })
    .catch((err) => console.log("error123"));
}

function onCopyLoc() {}

// render prev locations
function renderLoc() {
  locService.getLocs().then((locs) => {
    const strHTMLs = locs.map((loc) => {
      return `<div class="card flex">
            <p>Name: ${loc.name}</p>
                    <p>Lat: ${Math.floor(loc.lat)}</p>
                    <p>Lng: ${Math.floor(loc.lng)}</p>
                    <button onclick="onDeleteLoc('${loc.id}')">Delete</button>
                    <button onclick="onPanTo(${loc.lat}, ${loc.lng}, '${
        loc.name
      }', ${loc.id})">GO</button>
                    </div>
            `;
    });
    document.querySelector(".locs").innerHTML = strHTMLs.join("");
  });
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log("Getting Pos");
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// calling to the service to add marker
function onAddMarker(pos) {
  console.log("Adding a marker");
  mapService.addMarker(pos);
}

function onDeleteLoc(locIdx) {
  locService.deleteLoc(locIdx);
  renderLoc();
  locService.getLocs().then((locs) => {
    if (!locs.length) return; // add then its the last one
    gCurrLocIdx = 0;
    _renderCurrLocName(locs[0].name);
    console.log('moving to', locs[0].name);
    mapService.panTo(locs[0].lat, locs[0].lng, locs[0].name, locs[0].id);
  });
}

// shows saved locs, render
function onGetLocs() {
  locService.getLocs().then((locs) => {
    gCurrLocIdx = locs.length;
    console.log("gCurrLocIdx", gCurrLocIdx);
    console.log("Locations:", locs);
    document.querySelector(".locs").innerText = JSON.stringify(locs);
  });
}

// onclick func that showes user's loc - in HTML
// TODO: add onPanTo to show on map
function onGetUserPos() {
  getPosition()
    .then((pos) => {
      var position = {lat: pos.coords.latitude, lng: pos.coords.longitude}
      onPanTo(pos.coords.latitude, pos.coords.longitude, 'Home')
      onAddMarker(position, 'Home')
      document.querySelector(
        ".user-pos"

      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
    })
    .catch((err) => {
      console.log("err!!!", err);
    });
}

// render map according to chosed loc
function onPanTo(lat, lng, locName, locIdx) {
  console.log("Panning the Map");
  mapService.panTo(lat, lng);
  _renderCurrLocName(locName);
  gCurrLocIdx = locIdx;
}

// set names to correct loc names
function _renderCurrLocName(val) {
  document.querySelector(".loc-name span").innerText = val;
  document.querySelector("input[type=search]").value = val;
}
