const apiKey = '007c1b3240202dff77ecac92f7e1d1bc'; // Replace with your actual WeatherAPI.com key

window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeather, showError);
  } else {
    document.getElementById("weather").textContent = "Geolocation not supported.";
  }
};

async function showWeather(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API request failed");

    const data = await res.json();

    displayCurrent(data);
    displayForecast(data.forecast.forecastday);

  } catch (error) {
    console.error("Weather fetch error:", error.message);
    document.getElementById("weather").textContent = "Could not load weather data.";
  }
}

function displayCurrent(data) {
  const html = `
    <h2>${data.location.name}, ${data.location.country}</h2>
    <p>${data.current.condition.text}</p>
    <p>🌡️ Temp: ${data.current.temp_c}°C</p>
    <p>💧 Humidity: ${data.current.humidity}%</p>
    <p>🌬️ Wind: ${data.current.wind_kph} kph</p>
    <img src="https:${data.current.condition.icon}" alt="Weather icon" />
  `;
  document.getElementById("weather").innerHTML = html;
}

function displayForecast(days) {
  let forecastHTML = '';

  days.forEach(day => {
    forecastHTML += `
      <div class="card">
        <h4>${day.date}</h4>
        <img src="https:${day.day.condition.icon}" alt="Forecast icon" />
        <p>${day.day.avgtemp_c}°C</p>
        <p>${day.day.condition.text}</p>
      </div>
    `;
  });

  document.getElementById("forecast").innerHTML = forecastHTML;
}

function showError(error) {
  document.getElementById("weather").textContent = "Location access denied or unavailable.";
}
