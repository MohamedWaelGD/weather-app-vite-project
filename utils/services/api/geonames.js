const API_URL = import.meta.env.VITE_API_GEONAMES_URL;
const API_USERNAME = import.meta.env.VITE_API_GEONAMES_USERNAME;

const addApiUsernameInterceptor = (url) => {
    const urlObj = new URL(url);
    urlObj.searchParams.append('username', API_USERNAME);
    return urlObj.toString();
}

export async function getRandomCityName() {
    return new Promise(async (resolver, reject) => {
        let url = `${API_URL}/citiesJSON`;
        const urlObj = new URL(url);
        urlObj.searchParams.append('north', 90);
        urlObj.searchParams.append('south', -90);
        urlObj.searchParams.append('east', 180);
        urlObj.searchParams.append('west', -180);
        urlObj.searchParams.append('lang', 'en');
        url = passInterceptor(urlObj.toString());
        
        try {
            const response = await fetch(`${url}`);
            const json = response.json();
    
            if (!response.ok) {
                reject(json.message);
                return;
            }
            
            await json.then(res => {
                const randomIndex = Math.floor(Math.random() * res.geonames.length);
                const randomCity = res.geonames[randomIndex].toponymName;
                resolver(randomCity);
            });
        } catch(err) {
            reject('HTTP error! status:' + err.message);
            return;
        }
    });
}

function passInterceptor(url) {
    url = addApiUsernameInterceptor(url);
    return url;
}