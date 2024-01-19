import { animateShowSearchBar, animateHideSearchBar, animateShowLoading, animateHideLoading, animateShowAlert } from './animations/animations';
import { checkPermissionAndGetCurrentLocation, getWeatherWithLatAndLong, getWeatherWithName } from './services/api/weather-service';
import { addLocation, getLocations, removeLocation } from './services/saved-local-locations';
import { getRandomCityName } from './services/api/geonames';

const searchOpenBtn = document.getElementById('search-btn-open');
const searchCloseBtn = document.getElementById('search-btn-close');
const searchInp = document.getElementById('search-inp');
const backDropSearch = document.getElementsByClassName('back-drop-search')[0];
const cityNameText = document.getElementById('city-name');
const dateText = document.getElementById('date');
const tempText = document.getElementById('temp');
const stateText = document.getElementById('state');
const windSpeedText = document.getElementById('wind-speed');
const humidityText = document.getElementById('humidity');
const weatherIconImg = document.getElementById('weather-icon');
const form = document.getElementById('search-form');
const alert = document.getElementById('alert');
const locationsContainer = document.getElementById('locations');
const searchItem = document.getElementsByClassName('search-item')[0];
const randomBtn = document.getElementById('random-btn');

(function () {
    setupButtons();
    getLocation();
    handleSearchForm();
    getSavedLocations();
})();

function setupButtons() {
    searchOpenBtn.addEventListener('click', () => {
        animateShowSearchBar();
        searchInp.focus();
    });
    const hideAnimation = () => {
        searchInp.value = '';
        animateHideSearchBar();
    };
    searchCloseBtn.addEventListener('click', hideAnimation);
    backDropSearch.addEventListener('click', hideAnimation);
    randomBtn.addEventListener('click', getRandomCity);
}

function getLocation() {
    checkPermissionAndGetCurrentLocation().then(res => {
        const location = res;

        animateShowLoading();
        getWeatherWithLatAndLong(location.lat, location.long).then(res => {
            setWeatherDetails(res);
            getSavedLocations();
        }).catch(err => {
            alert.innerHTML = err;
            animateShowAlert();
        }).finally(()=>{
            animateHideLoading()
        });
    }).catch(err => {
        alert.innerHTML = err;
        animateShowAlert();
    });
}

function handleSearchForm() {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const searchValue = searchInp.value;

        if (!searchValue) return;

        animateShowLoading();
        getWeatherWithName(searchValue).then(res => {
            setWeatherDetails(res);
            addLocation(searchInp.value);
            searchInp.value = '';
            searchCloseBtn.click();
            getSavedLocations();
        }).catch(err => {
            alert.innerHTML = err;
            animateShowAlert();
        }).finally(()=>{
            
            animateHideLoading()
        });
    })
}

function setWeatherDetails(weather) {
    const wind = weather.wind;
    const main = weather.main;
    const weathers = weather.weather;
    const currentWeather = (weathers.length > 0) ? weathers[0] : null;

    const cityName = weather.name;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const temp = main.temp

    cityNameText.innerHtml = cityName;
    tempText.innerHTML = `${temp}°`;
    humidityText.innerHTML = `${humidity} %`;
    windSpeedText.innerHTML = `${windSpeed} M/s`;
    cityNameText.innerHTML = `${cityName}`;

    dateText.innerHTML = getCurrentDate();
    if (currentWeather) {
        weatherIconImg.src = `https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
        stateText.innerHTML = currentWeather.main;
    }
}

function getCurrentDate() {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const dayOfWeek = currentDate.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[dayOfWeek];
    return `Today, ${dayOfMonth} ${dayName}`;
}

function getSavedLocations() {
    const locations = getLocations();

    locationsContainer.innerHTML = '';
    locations.forEach(loc => {
        const cloned = searchItem.cloneNode(true);
        cloned.classList.remove('o-0');
        cloned.classList.remove('pointer-none');
        const span = cloned.querySelector('span');
        span.innerHTML = loc;
        cloned.addEventListener('click', () => {
            searchWithLocalName(loc);
        });
        locationsContainer.appendChild(cloned);
    });
}

function searchWithLocalName(name) {
    animateShowLoading();
    getWeatherWithName(name).then(res => {
        setWeatherDetails(res);
        searchCloseBtn.click();
        getSavedLocations();
    }).catch(err => {
        alert.innerHTML = err;
        animateShowAlert();
    }).finally(()=>{
        
        animateHideLoading()
    });
}

function getRandomCity() {
    animateShowLoading();
    getRandomCityName().then(city => {
        searchWithLocalName(city);
    });
}