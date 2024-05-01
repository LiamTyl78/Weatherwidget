const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const apiKey = "";
const card = document.querySelector(".card");
day = true;

weatherForm.addEventListener("submit", async event => {
    
    event.preventDefault();

    const city = cityInput.value;

    if (city) {
        try {
            const WeatherData = await getWeatherData(city);
            displayWeatherInfo(WeatherData);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city")
    }
});

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);

    console.log(response);
    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

function displayWeatherInfo(data){
    const {name: city,
           main: {temp, humidity}, 
           weather: [{description, id}]} = data;

    card.textContent = " ";
    card.style.display = "flex";
    
    cityDisplay = document.createElement("pday");
    tempDisplay = document.createElement("pday");
    humidityDisplay = document.createElement("pday");
    descDisplay = document.createElement("pday");
    weatherEmoji = document.createElement("pday");
    sunsetTime = document.createElement("pday");
    sunriseTime = document.createElement("pday");
    localTime = document.createElement("pday");
    
    if (new Date().getTime() > (data.sys.sunset * 1000) || new Date().getTime() < (data.sys.sunrise * 1000)) {
        day = false
        cityDisplay = document.createElement("pnight");
        tempDisplay = document.createElement("pnight");
        humidityDisplay = document.createElement("pnight");
        descDisplay = document.createElement("pnight");
        weatherEmoji = document.createElement("pnight");
        sunsetTime = document.createElement("pnight");
        sunriseTime = document.createElement("pnight");
        localTime = document.createElement("pnight");
    }
    else{
        cityDisplay = document.createElement("pday");
        tempDisplay = document.createElement("pday");
        humidityDisplay = document.createElement("pday");
        descDisplay = document.createElement("pday");
        weatherEmoji = document.createElement("pday");
        sunsetTime = document.createElement("pday");
        sunriseTime = document.createElement("pday");
        localTime = document.createElement("pday");
        day = true
    }
    
    cityDisplay.textContent = city;
    tempDisplay.textContent = `${((temp - 273.15)*(9/5)+32).toFixed(0)}°F`
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id, day);
    citytime = new Date((new Date().getTime() + (new Date().getTimezoneOffset() * 60 * 1000)) + (data.timezone * 1000));
    sunset = new Date((new Date((data.sys.sunset) * 1000).getTime() + (new Date().getTimezoneOffset() * 60 * 1000)) + (data.timezone * 1000));
    sunrise = new Date((new Date((data.sys.sunrise) * 1000).getTime() + (new Date().getTimezoneOffset() * 60 * 1000)) + (data.timezone * 1000));
    localTime.textContent = "Local Time: " + formatTime(citytime);
    sunsetTime.textContent = "Sunset: " + formatTime(sunset);
    sunriseTime.textContent = "Sunrise: " + formatTime(sunrise);
    
    


    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    localTime.classList.add("localTime");
    weatherEmoji.classList.add("weatherEmoji");
    sunriseTime.classList.add("sunriseTime");
    sunsetTime.classList.add("sunsetTime");
    
    
    night = document.querySelector(".night");
    daytime = document.querySelector(".day");
    

    if (day) {
        card.classList.add("day");
        card.classList.remove("night");
    }
    else{
        card.classList.add("night");
        card.classList.remove("day");
    }

    card.appendChild(localTime);
    card.appendChild(cityDisplay);
    card.appendChild(weatherEmoji);
    card.appendChild(tempDisplay);
    card.appendChild(descDisplay);
    card.appendChild(humidityDisplay);
    if (day) {
        card.appendChild(sunsetTime);
        if (card.contains(sunriseTime) ) {
            card.removeChild(sunriseTime);
        }
    }
    else{
        card.appendChild(sunriseTime);
        if (card.contains(sunsetTime) ) {
            card.removeChild(sunsetTime);
        
        }
    }


}

function getWeatherEmoji(weatherId, day){
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌦️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "🌨️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            if (day) {
                return "☀️";
            }
            else{
                return "🌙";
            }
        case (weatherId >= 801 && weatherId < 810):
            if (weatherId === 801) {
                return "⛅"
            }
            return "☁️";
        default:
            return "❔";
    }
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}

function formatTime(time) {
    cityMinutes = "";
    meridiem = "";
    if (time.getHours() < 12) {
        meridiem = "AM";
    }
    else{
        meridiem = "PM";
    }
    
    if (time.getMinutes() < 10) {
        cityMinutes = "0" + time.getMinutes();
    }
    else{
        cityMinutes = time.getMinutes();
    }
    if (time.getHours() < 13) {
        if (time.getHours() === 0) {
            return "12" + ":" + cityMinutes + " " + meridiem;
        }
        else{
            return time.getHours() + ":" + cityMinutes + " " + meridiem;
        }
    }
    else{
        return (time.getHours() - 12) + ":" + cityMinutes + " " + meridiem;
    } 
}