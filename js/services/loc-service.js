'use strict'

import { storageService } from './storage-service.js'
import { utilService } from './utils-service.js'

export const locService = {
    getLocs,
    addSaveLoc,
    deleteLoc,
    formatAdderss
}

const LOCS_KEY = 'locations-data'
var gSavedLocs = storageService.loadFromStorage(LOCS_KEY) || []

// return all saved locs
function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gSavedLocs);
        }, 2000)
    });
}

// saves location that the user search
function addSaveLoc(name, lat, lng){
    var olderLocIdx = gSavedLocs.findIndex(loc => loc.name === name)
    if(olderLocIdx < 0){
        var newLoc = _createSavedLoc(name, lat, lng)
        gSavedLocs.push(newLoc)
    } else gSavedLocs[olderLocIdx].updatedAt = Date.now()
    storageService.saveToStorage(LOCS_KEY, gSavedLocs)
}

// gets index of loc to delete
function deleteLoc(locIdx){
    var locToDeleteIdx = gSavedLocs.findIndex(loc => loc.id === locIdx)
    gSavedLocs.splice(locToDeleteIdx, 1)
    console.log('gSavedLocs after delete', gSavedLocs);
    storageService.saveToStorage(LOCS_KEY, gSavedLocs)
}

function _createSavedLoc(name, lat, lng){
    return {
        id: utilService.getRandomInt(0, 100),
        name: formatAdderss(name),
        lat,
        lng,
        // weather,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
}

function formatAdderss(name){
    var words = name.split(' ')
    var newWords = words.map( word => word[0].toUpperCase() + word.substring(1))
    return newWords.join(' ')
}
