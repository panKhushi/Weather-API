import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "e0241270e1a4147f2ca7d63097505119";

// Default forecast placeholders
const defaultForecast = [
  { day: "Mon", temp: "9°C", desc: "Light Rain" },
  { day: "Tue", temp: "8°C", desc: "Broken Clouds" },
  { day: "Wed", temp: "6°C", desc: "Scattered Clouds" },
  { day: "Thu", temp: "8°C", desc: "Overcast Clouds" },
  { day: "Fri", temp: "7°C", desc: "Overcast Clouds" },
];

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(defaultForecast);

  const getWeather = async () => {
    if (!city) return;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

      const res = await axios.get(url);
      const forecastRes = await axios.get(forecastUrl);

      setWeather(res.data);

      const fiveDays = forecastRes.data.list
        .filter((i) => i.dt_txt.includes("12:00:00"))
        .map((item) => ({
          day: new Date(item.dt_txt).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          temp: `${item.main.temp}°C`,
          desc: item.weather[0].main,
        }));

      setForecast(fiveDays);
    } catch (err) {
      alert("City not found!");
      console.log(err);
    }
  };

  return (
    <div className="main-card">

      {/* Title + Search */}
      <h2 className="title">Weather</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name (e.g., London, Tokyo)"
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Search</button>
      </div>

      {/* Weather section always visible but empty before search */}
      <div className="weather-section">
        {weather && (
          <>
            <h1>{weather.name}</h1>
            <p className="temp">{weather.main.temp}°C</p>
            <p>{weather.weather[0].description}</p>
          </>
        )}
      </div>

      <hr />

      {/* Forecast ALWAYS visible */}
      <h3 className="forecast-title">5-Day Forecast</h3>

      <div className="forecast-row">
        {forecast.map((f, i) => (
          <div key={i} className="forecast-box">
            <p className="day">{f.day}</p>
            <p className="temp-small">{f.temp}</p>
            <p className="desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
