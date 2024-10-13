# Weather App

A simple weather application that provides current weather data, hourly forecasts, and a five-day forecast for any given city. It utilizes the OpenWeatherMap API to fetch weather information based on user input or geolocation.

## Features

- Displays current weather conditions including temperature, humidity, and description.
- Provides hourly weather forecasts for the next 12 hours.
- Shows a five-day weather forecast with minimum and maximum temperatures.
- Retrieves weather information based on user input or by detecting the user's geolocation.

## Technologies Used

- JavaScript
- HTML
- CSS
- OpenWeatherMap API





## Code Overview

### API Endpoints

CURRENT_FORECAST_CORD: Endpoint for current weather data using coordinates.

CURRENT_FORECAST: Endpoint for current weather data using city name.

FIVE_DAY_FORECAST: Endpoint for five-day weather forecast.

GEO_LOCATION: Endpoint for retrieving geolocation data.


## Key Functions

formatTemp(value): Formats temperature values.

getIcon(iconCode): Generates the URL for weather icons.

loadCurrentForecast({lat, lon}): Loads the current weather forecast based on latitude and longitude.

getHourlyForecast(city): Retrieves hourly weather forecasts for the specified city.

createCurrentForecast(currentWeather): Creates and displays the current weather forecast on the UI.

createHourlyForecast(hourlyForecast): Displays hourly weather data.

createFiveDayForecast(hourlyForecast): Generates a five-day weather forecast.

getGeoLocationInfo(cityName): Fetches geolocation data based on city name.

onInput(event): Handles input events to fetch city suggestions based on user input.

## Project links
- [GitHub Repository](https://github.com/harithas1/Weather-app.git)

- [Live Demo](https://harithas1.github.io/Weather-app/) 