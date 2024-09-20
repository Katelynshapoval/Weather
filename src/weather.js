import React, { useState } from "react";
import axios from "axios";
import wind from "./wind-icon.svg"; // Import wind icon
import humidity from "./humidity.svg"; // Import humidity icon
import search from "./search.svg"; // Import search icon

const Weather = () => {
  const [city, setCity] = useState(""); // State for storing city input
  const [weatherData, setWeatherData] = useState(null); // State for storing weather data
  const [loading, setLoading] = useState(false); // State for managing loading status

  // Function to fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async () => {
    try {
      setLoading(true); // Set loading state to true before API call
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
      );
      setWeatherData(response.data); // Store the API response in weatherData state
      setLoading(false); // Set loading state to false after data is fetched
      weatherPic(response.data.weather[0].description); // Update weather icon
    } catch (error) {
      console.log(error); // Log any errors
      setLoading(false); // Ensure loading state is false even on error
    }
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload on form submit
    if (city) fetchWeatherData(); // Only fetch weather data if city input is provided
  };

  // Function to convert temperature from Kelvin to Celsius
  const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273);

  // Function to display the appropriate weather icon and update styling
  const weatherPic = (description) => {
    document.getElementById("weatherBlock").style.display = "block";

    // Grouping weather descriptions under common categories
    let imageFile = "normal.jpg"; // Default image

    if (description.includes("cloud")) {
      imageFile = "cloudy.jpg";
    } else if (description.includes("rain") || description.includes("shower")) {
      imageFile = "rainy.jpg";
    } else if (description.includes("snow")) {
      imageFile = "snowy.jpg";
    } else if (description.includes("thunderstorm")) {
      imageFile = "storm.jpg";
    }

    // Determine day or night for the background image
    const today = new Date();
    const hours = today.getHours();
    const period = hours >= 8 && hours <= 18 ? "day" : "night";

    // Adjust text color based on weather and time of day
    if (period === "night" || imageFile === "rainy.jpg") {
      document.getElementById("weatherBlock").style.color = "white";
    } else {
      document.getElementById("weatherBlock").style.color = "black";
    }

    // Update background image
    document.getElementById(
      "weatherBlock"
    ).style.backgroundImage = `url("images/${period}/${imageFile}")`;
  };

  return (
    <div>
      {/* Search form */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Search"
          autoFocus={true}
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)} // Update city input state
        />
        <button className="searchButton" type="submit">
          <img className="searchIcon" src={search} alt="Search" />{" "}
          {/* Search button with icon */}
        </button>
      </form>

      {/* Weather information display */}
      <div className="container">
        <div className="weatherBlock" id="weatherBlock">
          {/* Show loading message if data is being fetched */}
          {loading ? (
            <p>Loading...</p>
          ) : weatherData ? (
            <>
              {/* Display temperature, description, and city name */}
              <p id="temp">{kelvinToCelsius(weatherData.main.temp)}°</p>
              <p id="weather">{weatherData.weather[0].description}</p>
              <p id="cityName">{weatherData.name}</p>

              {/* Additional weather details like wind speed and humidity */}
              <div id="additionalInfo">
                <div className="wind-info">
                  <img className="inline" src={wind} alt="Wind" />
                  <p className="inline">{weatherData.wind.speed} m/s</p>
                </div>
                <div className="humidity-info">
                  <img className="inline" src={humidity} alt="Humidity" />
                  <p className="inline">{weatherData.main.humidity} %</p>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Weather;
