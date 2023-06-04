const API_KEY = '1635d22d186bcf53b7537519a2414b75'; // Replace with your OpenWeatherMap API key

// Event listener for form submission
document.getElementById('city-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const city = document.getElementById('city-input').value;
  getWeatherData(city);
});

// Get weather data for a given city
function getWeatherData(city) {
  // Retrieve coordinates for the city
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${'1635d22d186bcf53b7537519a2414b75'}`)
    .then(response => response.json())
    .then(data => {
      const { lat, lon } = data.coord;
      // Use coordinates to retrieve 5-day weather forecast
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${'1635d22d186bcf53b7537519a2414b75'}`)
        .then(response => response.json())
        .then(data => {
          displayWeatherData(data);
          saveCity(city);
        })
        .catch(error => console.error('Error:', error));
    })
    .catch(error => console.error('Error:', error));
}

// Display weather data on the page
function displayWeatherData(data) {
  const weatherContainer = document.getElementById('weather-container');
  weatherContainer.innerHTML = '';

  // Iterate over forecast data for the next 5 days
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000);
    const temperature = forecast.main.temp;
    const description = forecast.weather[0].description;

    const card = document.createElement('div');
    card.classList.add('card');

    const dateElement = document.createElement('div');
    dateElement.classList.add('date');
    dateElement.textContent = date.toLocaleDateString();
    const temperatureCelsius = Math.round(temperature - 273.15); // Convert temperature to Celsius and round up
    const temperatureFahrenheit = Math.round((temperature * 9) / 5 - 459.67); // Convert temperature to Fahrenheit and round up


    const temperatureElement = document.createElement('div');
    temperatureElement.classList.add('temperature');
    // temperatureElement.textContent = `Temperature: ${temperatureCelsius.toFixed(2)} °C`;
// or
    temperatureElement.textContent = `Temperature: ${temperatureFahrenheit.toFixed(2)} °F`;

    
    const descriptionElement = document.createElement('div');
    descriptionElement.classList.add('description');
    descriptionElement.textContent = `Description: ${description}`;

    card.appendChild(dateElement);
    card.appendChild(temperatureElement);
    card.appendChild(descriptionElement);

    weatherContainer.appendChild(card);
  }
}

// Save city to localStorage
function saveCity(city) {
  localStorage.setItem('lastCity', city);
}

// Load last searched city from localStorage
const lastCity = localStorage.getItem('lastCity');
if (lastCity) {
  getWeatherData(lastCity);
}
