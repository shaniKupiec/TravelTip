'use strict'

import { mapService } from './services/map.service.js'
import { locService } from './services/loc.service.js'


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
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

function onSearch(ev) {
    ev.preventDefault();
    const inputVal = document.querySelector('input[type=search]').value    
    mapService.searchByTxt(inputVal)
    .then(pos => {
        mapService.addMarker(pos)
        mapService.panTo(pos.lat, pos.lng)
        document.querySelector('.loc-name span').innerText = inputVal
        renderLoc()
    })
    .catch(err => console.log('error123'))
}

function onCopyLoc() {

}

function renderLoc() {
    locService.getLocs()
    .then(locs => {
        const strHTMLs = locs.map(loc => {
            return `<h1>Locations: </h1>
                    <p>Name: ${loc.name}</p>
                    <p>Lat: ${loc.lat}</p>
                    <p>Lng: ${loc.lng}</p>
                    <button onclick="onDeleteLoc('${loc.id}')">Delete</button>
            `
        })
        document.querySelector('.loc-table').innerHTML = strHTMLs.join('')
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
function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
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
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}