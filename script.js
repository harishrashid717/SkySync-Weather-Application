// APIs details
const appid = "dce84fd0adccc23096f510213e5a7563";
const tempBaseURL = "https://api.openweathermap.org/data/2.5/weather?&units=metric";
const geocodingBaseURL = "https://api.openweathermap.org/geo/1.0/reverse?&limit=3"

// finding latitude and longitude 
class FindCoordinates {
    constructor(){
        this.lat = null;
        this.long = null;
    }
    
    findCoordinates(){
        return new Promise((resolve, reject) => {
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition((position)=>{
                    this.lat = position.coords.latitude;
                    this.long = position.coords.longitude;
                    resolve({lat : this.lat, long : this.long })
                },(error)=>{
                    reject(error.message)
                } )
            }else{
                alert("Geolocation feture is not supported in your browser");
            }
        })
    }
}

// finding city name using API
class CityName{
    constructor(url, appid, lat, long){
        // this.city = null;
        this.geocodingBaseURL = url;
        this.appid = appid;
        this.latitude = lat;
        this.longitude = long;
    }

    async findCity(){
       let geocodingURL = `${this.geocodingBaseURL}&lat=${this.latitude}&lon=${this.longitude}&appid=${this.appid}`;
       console.log(geocodingURL);
        let cityLocation = await fetch(geocodingURL);
        let cityLocationData = await cityLocation.json();
        console.log(cityLocationData);
        return cityLocationData[0].name;
    }
}

class Weather{
    constructor(url, appid, city){
        this.tempBaseURL = url;
        this.appid = appid;
        this.city = city;
    }

    async displayWeather(){
        let tempURL =`${this.tempBaseURL}` +`&appid=${this.appid}` + `&q=${this.city}`;

        try {
            let response = await fetch(tempURL);
            let weatherInfo = await response.json(); // this takes time to execute that's why await is used here             
            // city name
            let city = Array.from(document.getElementsByClassName("name"));
            city.forEach((ele)=>{
                ele.innerHTML = weatherInfo.name;
            })
    
            // temperature
            let temp = Array.from(document.getElementsByClassName("temp"));
            temp.forEach((ele)=>{
                ele.innerHTML = weatherInfo.main.temp;
            })
            // minimum temperature
            let temp_min = Array.from(document.getElementsByClassName("temp_min"));
            temp_min.forEach((ele)=>{
                ele.innerHTML = weatherInfo.main.temp_min;
            })
    
            // maximum temperature 
            let temp_max = Array.from(document.getElementsByClassName("temp_max"));
            temp_max.forEach((ele)=>{
                ele.innerHTML = weatherInfo.main.temp_max;
            })
    
            // humidity
            let humidity = Array.from(document.getElementsByClassName("humidity"));
            humidity.forEach((ele)=>{
                ele.innerHTML = weatherInfo.main.humidity;
            })
    
            // temperature feels like
            let feels_like = Array.from(document.getElementsByClassName("feels_like"));
            feels_like.forEach((ele)=>{
                ele.innerHTML = weatherInfo.main.feels_like;
            })
    
            // pressure
            let pressure = Array.from(document.getElementsByClassName("pressure"));
            pressure.forEach((ele)=>{
                ele.innerHTML = weatherInfo.main.pressure;
            })
    
            // other info 
    
            let sunriseTimestamp = weatherInfo.sys.sunrise;
            let sunsetTimestamp = weatherInfo.sys.sunset;
            let sunriseDate = new Date(sunriseTimestamp * 1000);
            let sunsetDate = new Date(sunsetTimestamp * 1000);
    
            // Format the date and time
            let sunriseTime = sunriseDate.toLocaleTimeString();
            let sunsetTime = sunsetDate.toLocaleTimeString();
    
            sunrise.innerHTML = sunriseTime;
            sunset.innerHTML = sunsetTime;
    
            speed.innerHTML = weatherInfo.wind.speed;
            sky.innerHTML = weatherInfo.weather[0].description;
            
        } catch (error) {
            alert("Error fetching weather data:", error);           
        }
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
// finding latitude and longitude using geolocation web API
let geoLocation = new FindCoordinates();
geoLocation.findCoordinates().then((coordinates)=>{
    let cityData = new CityName(geocodingBaseURL, appid, coordinates.lat, coordinates.long );
    return cityData.findCity();
}).then((city)=>{
    let weather = new Weather(tempBaseURL, appid, city);
    weather.displayWeather()
})
let cityInput = document.getElementById('city-input');
cityInput.addEventListener('keyup', (event)=>{
    if(event.keyCode === 13){
        inputBtn.click();
    }
})
let inputBtn = document.getElementById('city-input-btn');
inputBtn.addEventListener('click', (event)=>{
    let cityInput = document.getElementById('city-input');
    event.preventDefault();
    let weather = new Weather(tempBaseURL, appid, cityInput.value);
    weather.displayWeather()
})
})