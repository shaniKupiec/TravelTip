'use strict'

import { mapService } from './services/map-service.js'
import { locService } from './services/loc-service.js'
import { weatherService } from './services/weather-service.js'


window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;
window.onCopyLoc = onCopyLoc;

// render map
function onInit() {
    mapService.initMap()
        .then(() => {
            renderLoc()
        })
        .catch(() => console.log('Error: cannot init map'));
}

// on user search show on map, add marker, save location
function onSearch(ev) {
    ev.preventDefault();
    const inputVal = document.querySelector('input[type=search]').value    
    mapService.searchByTxt(inputVal)
    .then(pos => {
        // mapService.addMarker(pos)
        onAddMarker(pos)
        mapService.panTo(pos.lat, pos.lng)
        document.querySelector('.loc-name span').innerText = inputVal
        renderLoc()
    })
    .catch(err => console.log('error123'))
}

function onCopyLoc() {

}

// render prev locations
function renderLoc() {
    locService.getLocs()
    .then(locs => {
        const strHTMLs = locs.map(loc => {
            return`<div class="card flex">
            <p>Name: ${loc.name}</p>
                    <p>Lat: ${loc.lat}</p>
                    <p>Lng: ${loc.lng}</p>
                    <button onclick="onDeleteLoc('${loc.id}')">Delete</button>
                    <button onclick="onPanTo(${loc.lat}, ${loc.lng})">GO</button>
                    </div>
            `
        })
        document.querySelector('.locs').innerHTML = strHTMLs.join('')
    })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

// calling to the service to add marker
// TODO: need to add curr pos
function onAddMarker(pos) {
    console.log('Adding a marker');
    mapService.addMarker(pos);
}

function onDeleteLoc(locIdx){
    locService.deleteLoc(locIdx)
}

// shows saved locs, render
function onGetLocs() { 
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

// onclick func that showes user's loc - in HTML
// TODO: add onPanTo to show on map
function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

// render map according to chosed loc
// TODO: get wanted loc
function onPanTo(lat, lng) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
}