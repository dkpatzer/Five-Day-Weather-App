# Five-Day-Weather-App
This is a weather app that displays the current weather and the five-day forecast for a given city. It uses the OpenWeather API to get the weather data, and the latitude and longitude of the city. It uses the following technologies: HTML, CSS, Javascript, Openweather API and the Font Awesome API. It is deployed to GitHub Pages.  

Instructions for Use
1. Enter the name of the city in the search box.
2. Click the search button.
3. The current weather and the five-day forecast for the city will display.
4. The city will be added to the search history.
5. Click on a city in the search history to display the weather for that city.
6. Click the clear button to clear the search history.

Discussion of HTML code used:
Within the head tag, the following is used: Viewport meta tag, Bootstrap CSS link, Font Awesome CSS link, and the link to th style.css file.

Discusison of the JavaScript code used:
A const variable is declared for the API key.
Elements from the DOM are selected and assigned to variables. Query selectors are used to select the elements to update and manipulate the DOM.
A const variable is declared for the city input.
A const variable is declared for the search button.
A const variable is declared for the clear button.
A const variable is declared for the search history.
A const variable is declared for the current weather.
A const variable is declared for the city name.
A const variable is declared for the current date.
A const variable is declared for the current weather icon.
A const variable is declared for the current temperature.
A const variable is declared for the current humidity.
A const variable is declared for the current wind speed.
A const variable is declared for the five-day forecast.

The default city is set to Nashville and stored in local storage.
The last city searched coordinates is retrieved from local storage and the getCoordinates() function retrieves its coordinates, if none is found the default city's coordinates are retrieved.
The search history is retrieved from local storage and iterates through an array to create a button for each city in the search history and the buttond are appended to the historyFormE1 element.
THe first letter of each city in the search history is capitalized.
The function searchCity() which is the event handler for the seach button click event prevents default behavior, trims the value of the city input element, and calls the getCoordinates() function.
The function getCoordinates() uses the OpenWeatherMap API to get the latitude and longitude of the city makes an HTTP GET request using fetch() and extracts the coordinates from the response.
The function getWeather() uses the OpenWeatherMap API to get the current weather and the five-day forecast for the city and makes an HTTP GET request using fetch() and extracts the weather data from the response.
The function displayWeather() removes the d-none class from the currentWeatherEl element and updates the DOM with the current weather data.
The function saveSearchHistory() saves the city to local storage and adds a button to the search history.
The function selectCity(event) is the event handler for the search history buttons and calls the getCoordinates() function.
THe function getCurrentDate() returns the current date in a specific format, creates a new date object, and formats the date.
The function getForecastDate() returns the date in a specific format, creates a new date object, and formats the date.
The function convertKelvintoCelsius() converts the temperature from Kelvin to Celsius.
THe function convertCelciustoFahrenheit() converts the temperature from Celsius to Fahrenheit.
Event listeners are added to the search button, the clear button, and the search history buttons and the setDefaultCity() function is called.

Credits:

The Five-Day Weather App was developed by David Patzer as part of the NU coding bootcamp. I obtained information from many sources to help put this together. This includes: OpenWeatherMap API Documentation/OpenWeatherMap API Guides and Tutorials at: https://openweathermap.org/api, MDN's DOM manipulation documentation at https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model, Stack Overflow, Display 7 Day Weather Forecast with OpenWeather API https://javascript.plainenglish.io/display-7-day-weather-forecast-with-openweather-api-aac8ba21c9e3, W3Schools, and a YouTube video Build a Weather App with HTML, CSS & JavaScript by Jonah Lawrence • Dev Pro Tips, and  I found and reviewd an app on GitHub  https://github.com/sylviaprabudy/weather-dashboard. In addition, I used ChatGpt, not to build the app but to check my code and explain some aspepects of the code.



