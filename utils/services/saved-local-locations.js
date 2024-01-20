const STORAGE = 'WEATHER_LOCATIONS_SAVED';

export function addLocation(location) {
    if (isLocationAlreadyIn(location)) return;
    
    const locations = getLocations();

    locations.push(location);
    localStorage.setItem(STORAGE, JSON.stringify(locations));
}

export function removeLocation(location) {
    let locations = getLocations();

    locations = locations.filter(e => e !== location);
    localStorage.setItem(STORAGE, JSON.stringify(locations));
}

export function getLocations() {
    let storedLocations = localStorage.getItem(STORAGE);

    if (storedLocations) {
        storedLocations = JSON.parse(storedLocations);
        if (Array.isArray(storedLocations)) return storedLocations;

        return [storedLocations];
    }

    return [];
}

function isLocationAlreadyIn(location) {
    const locations = getLocations();

    const selectedLoc = locations.find(e => e === location);
    if (selectedLoc) return true;

    return false;
}