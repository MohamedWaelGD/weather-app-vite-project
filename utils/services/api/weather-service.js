const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const WEATHER_UNIT = 'metric';

const addApiKeyInterceptor = (url) => {
    const urlObj = new URL(url);
    urlObj.searchParams.append('appid', API_KEY);
    return urlObj.toString();
}

const addMetricUnitInterceptor = (url) => {
    const urlObj = new URL(url);
    urlObj.searchParams.append('units', WEATHER_UNIT);
    return urlObj.toString();
}

export async function checkPermissionAndGetCurrentLocation() {
    return new Promise((resolver, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = onGetLocation(position);
                    resolver(location);
                },
                (error) => {
                    const message = onError(error);
                    reject(message);
                }
            )
        } else {
            reject("Geolocation not supported by your browser");
        }
    });
}

function onGetLocation(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    return {
        lat: lat,
        long: long
    }
}

function onError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return "Location permission denied by the user.";
        case error.POSITION_UNAVAILABLE:
            return "Location information is unavailable.";
        case error.TIMEOUT:
            return "The request to get user location timed out.";
        case error.UNKNOWN_ERROR:
            return "An unknown error occurred.";
        default: 
            return "An unknown error occurred.";
    }
}

export async function getWeatherWithLatAndLong(lat, long) {
    return new Promise(async (resolver, reject) => {
        let url = `${API_URL}/weather`;
        const urlObj = new URL(url);
        urlObj.searchParams.append('lat', lat);
        urlObj.searchParams.append('lon', long);
        url = passInterceptor(urlObj.toString());
        
        try {
            const response = await fetch(`${url}`);
            const json = response.json();
    
            if (!response.ok) {
                reject(json.message);
                return;
            }
    
            resolver(json);
        } catch(err) {
            reject('HTTP error! status:' + err.message);
            return;
        }
    });
}

export async function getWeatherWithName(search) {
    return new Promise(async (resolver, reject) => {
        let url = `${API_URL}/weather`;
        const urlObj = new URL(url);
        urlObj.searchParams.append('q', search);
        url = passInterceptor(urlObj.toString());
        
        try {
            const response = await fetch(`${url}`);
            const json = response.json();
    
            if (!response.ok) {
                await json.then(res => {
                    reject(res.message);
                });
            }
    
            resolver(json);
        } catch(err) {
            reject('HTTP error! status:' + err.message);
        }
    });
}

function passInterceptor(url) {
    url = addApiKeyInterceptor(url);
    url = addMetricUnitInterceptor(url);
    return url;
}