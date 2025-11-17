// Simple client-only weather app using Open-Meteo (no API key)
const KEY_CITY = "weather_client_last_city_v1";
const THEME_KEY = "weather_theme_v1"; // 'light' | 'dark'

const el = {
  form: document.querySelector("#form"),
  inputCity: document.querySelector("#city"),
  themeToggle: document.querySelector("#themeToggle"),
  status: document.querySelector("#status"),
  result: document.querySelector("#result"),
  cityName: document.querySelector("#cityName"),
  desc: document.querySelector("#desc"),
  temp: document.querySelector("#temp"),
  wind: document.querySelector("#wind"),
};

function setStatus(msg, isError) {
  el.status.textContent = msg || "";
  el.status.classList.toggle("muted", !isError);
}

function saveLastCity(c) {
  try {
    localStorage.setItem(KEY_CITY, c);
  } catch (e) {
    console.log(e);
  }
}
function loadLastCity() {
  try {
    return localStorage.getItem(KEY_CITY);
  } catch (e) {
    console.log(e);
  }
}

function saveTheme(t) {
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch (e) {
    console.log(e);
  }
}
function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "dark";
  } catch (e) {
    return "dark";
  }
}
function applyTheme(t) {
  if (t === "light") document.body.classList.add("theme-light");
  else document.body.classList.remove("theme-light");
}

// Geocode with Open-Meteo geocoding API (no key)
async function geocode(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding failed: " + res.statusText);
  const data = await res.json();

  if (!data.results || data.results.length === 0)
    throw new Error("City not found");
  const r = data.results[0];
  return {
    name: r.name,
    country: r.country,
    lat: r.latitude,
    lon: r.longitude,
  };
  // Fetch current weather from Open-Meteo
}

// Fetch current weather from Open-Meteo
async function fetchWeatherByLatLon(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&windspeed_unit=ms`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed: " + res.statusText);
  const data = await res.json();
  if (!data.current_weather) throw new Error("No current weather data");
  return data.current_weather; // {temperature, windspeed, winddirection, weathercode, time}
}

const WEATHER_CODES = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Drizzle: Light",
  53: "Drizzle: Moderate",
  55: "Drizzle: Dense",
  56: "Freezing drizzle: Light",
  57: "Freezing drizzle: Dense",
  61: "Rain: Slight",
  63: "Rain: Moderate",
  65: "Rain: Heavy",
  66: "Freezing rain: Light",
  67: "Freezing rain: Heavy",
  71: "Snow fall: Slight",
  73: "Snow fall: Moderate",
  75: "Snow fall: Heavy",
  77: "Snow grains",
  80: "Rain showers: Slight",
  81: "Rain showers: Moderate",
  82: "Violent rain showers",
  85: "Snow showers: Slight",
  86: "Snow showers: Heavy",
  95: "Thunderstorm: Slight or moderate",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

// Simple emoji map to show a small icon for common codes.
const WEATHER_EMOJI = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  56: "🌧️",
  57: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  66: "🌧️",
  67: "🌧️",
  71: "❄️",
  73: "❄️",
  75: "❄️",
  77: "❄️",
  80: "🌧️",
  81: "🌧️",
  82: "🌧️",
  85: "❄️",
  86: "❄️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

function renderResult(place, current) {
  el.cityName.textContent = `${place.name}, ${place.country || ""}`;
  const code = current.weathercode;
  const description = WEATHER_CODES[code] || "Weather code " + code;
  const emoji = WEATHER_EMOJI[code] ? WEATHER_EMOJI[code] + " " : "";
  el.desc.textContent = emoji + description;
  el.temp.textContent = `${Math.round(current.temperature)} °C`;
  el.wind.textContent = `Wind: ${current.windspeed} m/s`;
  el.result.classList.remove("hidden");
}

async function handleLookup(city) {
  try {
    setStatus("Looking up…");
    el.result.classList.add("hidden");
    const place = await geocode(city);
    setStatus("Fetching weather…");
    const current = await fetchWeatherByLatLon(place.lat, place.lon);
    renderResult(place, current);
    saveLastCity(city);
    setStatus("");
  } catch (err) {
    console.error(err);
    setStatus("Error: " + (err.message || err), true);
  }
}

function init() {
  // theme: initialize and wire toggle
  const curTheme = loadTheme();
  applyTheme(curTheme);
  if (el.themeToggle) {
    el.themeToggle.setAttribute(
      "aria-pressed",
      curTheme === "light" ? "true" : "false"
    );
    el.themeToggle.textContent = curTheme === "light" ? "🌞" : "🌙";
    el.themeToggle.addEventListener("click", () => {
      const next = loadTheme() === "light" ? "dark" : "light";
      applyTheme(next);
      saveTheme(next);
      el.themeToggle.setAttribute(
        "aria-pressed",
        next === "light" ? "true" : "false"
      );
      el.themeToggle.textContent = next === "light" ? "🌞" : "🌙";
    });
  }
  const savedCity = loadLastCity();
  if (savedCity) el.inputCity.value = savedCity;
  el.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = el.inputCity.value.trim();
    if (!city) {
      setStatus("Enter a city", true);
      return;
    }
    handleLookup(city);
  });
  if (savedCity) handleLookup(savedCity);
}

document.addEventListener("DOMContentLoaded", init);
