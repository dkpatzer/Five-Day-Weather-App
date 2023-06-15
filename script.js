const apiKey = '541b8a096fbdd859aa865feaadefa64b';
let searchHistory = [];

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

searchButtonEl.addEventListener("click", searchCity);
clearButtonEl.addEventListener("click", clearHistory);
historyFormEl.addEventListener("click", selectCity);

function searchCity(event) {
  event.preventDefault();

  const city = cityInputEl.value.trim();

  if (city) {
    getCoordinates(city);
    cityInputEl.value = "";
  }
}

function getCoordinates(city) {
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
      // Handle error in case of network failure
    });
}

function getWeather(city, latitude, longitude) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayWeather(city, data);
      saveSearch(city);
    })
    .catch(function (error) {
      // Handle error in case of network failure
    });
}

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
  temperatureEl.textContent = `Temperature: ${convertKelvinToCelsius(
    currentWeather.main.temp
  )} °C`;
  humidityEl.textContent = `Humidity: ${currentWeather.main.humidity}%`;
  windSpeedEl.textContent = `Wind Speed: ${currentWeather.wind.speed} m/s`;

  for (let i = 1; i <=5; i++) {
    const forecast = data.list[(i * 8)-1];
    const forecastDate = getForecastDate(i);
    const forecastIconCode = forecast.weather[0].icon;
    const forecastIconURL = `http://openweathermap.org/img/w/${forecastIconCode}.png`;

    forecastEls[i - 1].textContent = forecastDate;
    forecastEls[i - 1].innerHTML += `<img src="${forecastIconURL}" alt="">`;
    forecastEls[i - 1].innerHTML += `<p>Temperature: ${convertKelvinToCelsius(
      forecast.main.temp
    )} °C</p>`;

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
    historyButton.setAttribute("class", "btn btn-secondary");
    historyButton.textContent = city;

    historyFormEl.appendChild(historyButton);
  }
}

function loadSearchHistory() {
  const savedHistory = localStorage.getItem("searchHistory");

  if (savedHistory) {
    searchHistory = JSON.parse(savedHistory);

    for (let i = 0; i < searchHistory.length; i++) {
      const historyButton = document.createElement("button");
      historyButton.setAttribute("type", "button");
      historyButton.setAttribute("class", "btn btn-secondary");
      historyButton.textContent = searchHistory[i];

      historyFormEl.appendChild(historyButton);
    }
  }
}

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

function getCurrentDate() {
  const currentDate = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  return currentDate.toLocaleDateString("en-US", options);
}

function getForecastDate(day) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + day);
  const options = { weekday: "long", month: "long", day: "numeric" };
  return currentDate.toLocaleDateString("en-US", options);
}

function convertKelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2);
}

loadSearchHistory();


