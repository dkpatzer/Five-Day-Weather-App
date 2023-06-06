const API_KEY = '541b8a096fbdd859aa865feaadefa64b'; // Replace with your OpenWeatherMap API key

const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const currentWeatherContainer = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast-container');
const previousCitiesContainer = document.getElementById('previous-cities-container');

// Handle form submission
cityForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (city) {
    getWeatherData(city);
    cityInput.value = '';
  }
});

// Get weather data for a given city
function getWeatherData(city) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${'541b8a096fbdd859aa865feaadefa64b'}`;

  fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      getForecastData(data.coord.lat, data.coord.lon);
      addCityToHistory(city);
    })
    .catch(error => console.error('Error:', error));
}

// Display current weather conditions
function displayCurrentWeather(data) {
  const { name, dt, main, weather, wind } = data;
  const temperatureCelsius = Math.round(main.temp - 273.15); // Convert temperature to Celsius and round up
  const temperatureFahrenheit = Math.round((main.temp * 9) / 5 - 459.67); // Convert temperature to Fahrenheit and round up

  const currentDate = new Date(dt * 1000).toLocaleDateString();

  // Check if iconURL is defined and not empty
  const iconURL = weather[0].icon ? `https://openweathermap.org/img/w/${weather[0].icon}.png` : '';

  const html = `
    <div class="card">
      <h2>${name} (${currentDate})</h2>
      <img src="${iconURL}" alt="Weather Icon">
      <p>Temperature: ${temperatureCelsius} °C / ${temperatureFahrenheit} °F</p>
      <p>Humidity: ${main.humidity}%</p>
      <p>Wind Speed: ${wind.speed} m/s</p>
    </div>
  `;

  currentWeatherContainer.innerHTML = html;
}

// Get 5-day forecast for a given coordinates
function getForecastData(lat, lon) {
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${'541b8a096fbdd859aa865feaadefa64b'}`;

  fetch(forecastURL)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => console.error('Error:', error));
}

// Display forecast
function displayForecast(data) {
  const forecastHeader = document.getElementById('forecast-header');

  if (forecastHeader) {
    forecastHeader.textContent = '5-Day Forecast';
  }

  forecastContainer.innerHTML = '';

  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = date.getDate();

    const temperatureCelsius = Math.round(forecast.main.temp - 273.15);
    const temperatureFahrenheit = Math.round((forecast.main.temp * 9) / 5 - 459.67);

    const iconURL = forecast.weather[0].icon ? `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png` : '';

    const html = `
      <div class="forecast-card">
        <h3>${day}</h3>
        <p>${month} ${dayNumber}</p>
        <img src="${iconURL}" alt="Weather Icon">
        <p>Temp: ${temperatureCelsius} °C / ${temperatureFahrenheit} °F</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
        <p>Wind: ${forecast.wind.speed} m/s</p>
      </div>
    `;

    forecastContainer.innerHTML += html;
  }
}

// Add city to search history
function addCityToHistory(city) {
  const history = localStorage.getItem('searchHistory') || '[]';
  const searchHistory = JSON.parse(history);

  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory(searchHistory);
  }
}

// Display search history
function displaySearchHistory(searchHistory) {
  previousCitiesContainer.innerHTML = '';

  searchHistory.forEach(city => {
    const html = `
      <div class="previous-search">
        <button onclick="getWeatherData('${city}')">${city}</button>
      </div>
    `;

    previousCitiesContainer.innerHTML += html;
  });
}

// Load search history from local storage
function loadSearchHistory() {
  const defaultCity = 'Nashville';
  const defaultLatitude = 36.162230;
  const defaultLongitude = -86.774353;

  getWeatherData(defaultCity, defaultLatitude, defaultLongitude);

  const history = localStorage.getItem('searchHistory') || '[]';
  const searchHistory = JSON.parse(history);
  displaySearchHistory(searchHistory);
}




// Call the loadSearchHistory function after defining it
loadSearchHistory();








