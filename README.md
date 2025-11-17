Simple client-only weather app (Open-Meteo)

This small demo uses Open-Meteo's geocoding and forecast APIs and requires no API key.

I created a prototype using AI, reviewed the code myself, and made modifications.

How it works

- User enters a city name.
- The app calls Open-Meteo Geocoding API to get latitude/longitude.
- Then it calls Open-Meteo Forecast API with `current_weather=true` to retrieve the current temperature and wind.
- The last searched city is saved to localStorage.
- Click the moon and sun icons to toggle between light mode and dark mode.

To run

- Open `weather-app-client/index.html` in your browser (or serve with a static server).

Notes

- This is suitable for demos and avoids shipping any API keys.
- The geocoding API returns best-effort matches; if multiple cities share the same name, the top result is used.
