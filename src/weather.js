import React, { useState } from "react";
import axios from "axios";
import wind from "./wind-icon.svg";
import humidity from "./humidity.svg";
import search from "./search.svg";

const Weather = () => {
  const [city, setCity] = useState(""); // State for city input
  const [weatherData, setWeatherData] = useState(null); // State for storing weather data
  const [loading, setLoading] = useState(false); // Loading state for handling API call status

  // Function to fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async () => {
    try {
      setLoading(true); // Set loading state to true
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
      );
      setWeatherData(response.data); // Store API response in state
      setLoading(false); // Set loading state to false after fetching
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading state to false on error
    }
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (city) fetchWeatherData(); // Only fetch if city input is provided
  };

  // Function to convert temperature from Kelvin to Celsius
  const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273);

  // Function to return the appropriate weather icon based on description
  const weatherPic = (description) => {
    const picMap = {
      "clear sky": "clear.png",
      "few clouds": "half-cloudy.png",
      "scattered clouds": "cloudy.png",
      "broken clouds": "cloudy.png",
      "overcast clouds": "cloudy.png",
      "shower rain": "rainy.png",
      rain: "heavvy-rain.png",
      thunderstorm: "storm.png",
      snow: "snow.png",
      mist: "mist.png",
    };

    const today = new Date();
    const hours = today.getHours();
    const period = hours >= 8 && hours <= 18 ? "day" : "night"; // Determine day or night

    return `images/${period}/${picMap[description] || ""}`;
  };

  return (
    <div>
      {/* Weather block container */}
      <div className="container">
        <div className="weatherBlock">
          {/* Form for city input */}
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Search"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
            <button className="searchButton" type="submit">
              <img className="searchIcon" src={search} alt="Search" />
            </button>
          </form>

          {/* Display weather data if available */}
          {loading ? (
            <p>Loading...</p> // Loading message during data fetch
          ) : weatherData ? (
            <>
              <p>{weatherData.weather[0].description}</p>
              <img
                className="weatherIcon"
                src={weatherPic(weatherData.weather[0].description)}
                alt="Weather Icon"
              />
              <p>{kelvinToCelsius(weatherData.main.temp)}°C</p>
              <p>{weatherData.name}</p>
              <div className="wind-info">
                <img className="inline" src={wind} alt="Wind" />
                <p className="inline">{weatherData.wind.speed} m/s</p>
              </div>
              <div className="humidity-info">
                <img className="inline" src={humidity} alt="Humidity" />
                <p className="inline">{weatherData.main.humidity}%</p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Weather;
