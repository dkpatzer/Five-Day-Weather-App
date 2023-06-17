// Set api key for openweathermap.org and create an empty array for search history
const apiKey = '541b8a096fbdd859aa865feaadefa64b';
let searchHistory = [];
// Select elements from the DOM using their id or class name using querySelector to update and manipulate the DOM
const cityInputEl = document.querySelector("#city-input");
const searchButtonEl = document.querySelector("#search-button");
const clearButtonEl = document.querySelector("#clear-button");
const historyFormEl = document.querySelector("#history");
const currentWeatherEl = document.querySelector("#current-weather");
const cityNameEl = document.querySelector("#city-name");
const currentPicEl = document.querySelector("#current-pic");
const temperatureEl = document.querySelector("#temperature");
const humidityEl = document.querySelector("#humidity");
const windSpeedEl = document.querySelector("#wind-speed");
const forecastEls = document.querySelectorAll(".forecast");

function setDefaultCity() {
  // Store the default city as Nashville, TN and store in the browser's localStorage
  localStorage.setItem("defaultCity", "Nashville, TN");
}

function loadLastCity() {
  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
    getCoordinates(lastCity);
  } else {
    setDefaultCity();
    const defaultCity = localStorage.getItem("defaultCity");
    getCoordinates(defaultCity);
  }
}
// Load the last city searched for when the page is loaded
function loadSearchHistory() {
  const savedHistory = localStorage.getItem("searchHistory");

  if (savedHistory) {
    searchHistory = JSON.parse(savedHistory);
  // iterate through the search history array and create a button for each city
    for (let i = 0; i < searchHistory.length; i++) {
      const historyButton = document.createElement("button");
      historyButton.setAttribute("type", "button");
      historyButton.classList.add("btn", "btn-success", "previous-city");
      historyButton.textContent = capitalizeFirstLetter(searchHistory[i]);

      historyFormEl.appendChild(historyButton);
    }
  }
}
// Capitalize the first letter of each word in the city name. Use slice to return the rest of the string after the first letter
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
// call the loadSearchHistory function when search button is clicked. Trim the city name and call the getCoordinates function
function searchCity(event) {
  event.preventDefault();

  const city = cityInputEl.value.trim();

  if (city) {
    getCoordinates(city);
    cityInputEl.value = "";
  }
}
// Pass the latitude, and longitude to the getWeather function
// Fetch function to send an HTTP GET request to the openweathermap.org API
function getCoordinates(city) {
  if (city === "") {
    // Default city: Nashville, TN
    const latitude = 36.1627;
    const longitude = -86.7816;
    getWeather(city, latitude, longitude);
  } else {
    const coordinatesURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(coordinatesURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.length === 0) {
          return;
        }

        const latitude = data[0].lat;
        const longitude = data[0].lon;

        getWeather(city, latitude, longitude);
      })
      .catch(function (error) {
        console.log("Error fetching coordinates:", error);
        // Handle error in case of network failure
      });
  }
}
// Retrieve weather forecast data for a given city using the api key, latitude and longitude
function getWeather(city, latitude, longitude) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
// fetch function to send an HTTP GET request to the openweathermap.org API
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayWeather(city, data);
      saveSearch(city);
    })
    .catch(function (error) {
      console.log("Error fetching weather data:", error);
      // Handle error in case of network failure

    });
}


// Update the weather forecast for the city that was searched for
// Remove the d-none class from the currentWeatherEl element to make it visible
// Display the city name, current weather icon, temperature, humidity, and wind speed by extracting from the data object and updating the DOM
function displayWeather(city, data) {
  currentWeatherEl.classList.remove("d-none");
  cityNameEl.textContent = city;
  currentPicEl.setAttribute("src", "");
  temperatureEl.textContent = "";
  humidityEl.textContent = "";
  windSpeedEl.textContent = "";

  for (let i = 0; i < forecastEls.length; i++) {
    forecastEls[i].textContent = "";
  }

  const currentWeather = data.list[0];
  const iconCode = currentWeather.weather[0].icon;
  const iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;

  cityNameEl.textContent = `${city} (${getCurrentDate()})`;
  currentPicEl.setAttribute("src", iconURL);

  const celsius = convertKelvinToCelsius(currentWeather.main.temp);
  const fahrenheit = convertCelsiusToFahrenheit(celsius);
  temperatureEl.innerHTML = `Temperature: ${celsius} °C / ${fahrenheit} °F`;

  humidityEl.textContent = `Humidity: ${currentWeather.main.humidity}%`;
  windSpeedEl.textContent = `Wind Speed: ${currentWeather.wind.speed} m/s`;

  for (let i = 1; i <= 5; i++) {
    const forecast = data.list[i * 8 - 1];
    const forecastDate = getForecastDate(i);
    const forecastIconCode = forecast.weather[0].icon;
    const forecastIconURL = `http://openweathermap.org/img/w/${forecastIconCode}.png`;

    forecastEls[i - 1].textContent = forecastDate;
    forecastEls[i - 1].innerHTML += `<img src="${forecastIconURL}" alt="">`;

    const forecastCelsius = convertKelvinToCelsius(forecast.main.temp);
    const forecastFahrenheit = convertCelsiusToFahrenheit(forecastCelsius);
    forecastEls[i - 1].innerHTML += `<p>Temperature: ${forecastCelsius} °C / ${forecastFahrenheit} °F</p>`;

    forecastEls[i - 1].innerHTML += `<p>Wind Speed: ${forecast.wind.speed} m/s</p>`;
    forecastEls[i - 1].innerHTML += `<p>Humidity: ${forecast.main.humidity}%</p>`;
  }
}

function saveSearch(city) {
  if (searchHistory.indexOf(city) === -1) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    const historyButton = document.createElement("button");
    historyButton.setAttribute("type", "button");
    historyButton.classList.add("btn", "btn-success", "previous-city");
    historyButton.textContent = capitalizeFirstLetter(city);
    historyFormEl.appendChild(historyButton);
  }

  localStorage.setItem('lastCity', city); 
}
// clear the search history, empty the searchHistory array and remove the search history from the DOM
function clearHistory() {
  localStorage.removeItem("searchHistory");
  searchHistory = [];
  historyFormEl.innerHTML = "";
}

function selectCity(event) {
  if (event.target.matches("button")) {
    const selectedCity = event.target.textContent;
    getCoordinates(selectedCity);
  }
}
// return current and create a new date object
function getCurrentDate() {
  const currentDate = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  return currentDate.toLocaleDateString("en-US", options);
}
// return the date for the forecast
function getForecastDate(day) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + day);
  const options = { weekday: "long", month: "long", day: "numeric" };
  return currentDate.toLocaleDateString("en-US", options);
}
// convert temperature from Kelvin to Celsius and round to 2 decimal places
function convertKelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2);
}
// Convert temperature from Celsius to Fahrenheit and round to nearest integer
function convertCelsiusToFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}


// Load last city or default city on page load
window.addEventListener('DOMContentLoaded', function () {
  loadLastCity();
});
// Event listeners for search, clear and history buttons
searchButtonEl.addEventListener("click", searchCity);
clearButtonEl.addEventListener("click", clearHistory);
historyFormEl.addEventListener("click", selectCity);
// Call function to set default city and store in local storage
setDefaultCity();


