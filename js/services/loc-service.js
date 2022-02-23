'use strict'

import { storageService } from './storage-service.js'

export const locService = {
    getLocs,
    addSaveLoc,
    deleteLoc
}

const LOCS_KEY = 'locations-data'
var gId = 100;
var gSavedLocs = storageService.loadFromStorage(LOCS_KEY) || []

// return all saved locs
// WHY: set time out??
function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gSavedLocs);
        }, 2000)
    });
}

// saves location that the user search
// TODO: link to service function search
function addSaveLoc(name, lat, lng){
    var olderLocIdx = gSavedLocs.findIndex(loc => loc.name === name)
    if(olderLocIdx === -1){
        var newLoc = _createSavedLoc(name, lat, lng)
        gSavedLocs.push(newLoc)
    } else gSavedLocs[olderLocIdx].updatedAt = Date.now()
    storageService.saveToStorage(LOCS_KEY, gSavedLocs)
}

// gets index of loc to delete
// TODO: connect to onDeleteLoc
function deleteLoc(locIdx){
    var locToDeleteIdx = gSavedLocs.findIndex(loc => loc.id === locIdx)
    gSavedLocs.splice(locToDeleteIdx, 1)
    gSavedLocs.push(newLoc)
}

function _createSavedLoc(name, lat, lng){
    return {
        id: gId++,
        name,
        lat,
        lng,
        // weather,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
}
