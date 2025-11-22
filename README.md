# Simple client-only weather app (Open-Meteo)

[![Live Demo](https://img.shields.io/badge/Live_Demo-👀_Click_here!-blue?style=for-the-badge&logo=github)](https://shotaro-dev.github.io/weather-app-client/)

This small demo uses Open-Meteo's geocoding and forecast APIs and requires no API key.

## How this project was built

- Learning project
- Initial skeleton generated with GitHub Copilot
- The rest was vibe-driven development with heavy AI assistance
- Every line was **reviewed, tested, and either kept with confidence or rewritten/deleted by me**  
  → The final code contains only what I'm confident in and take responsibility for


### How it works

- User enters a city name.
- The app calls Open-Meteo Geocoding API to get latitude/longitude.
- Then it calls Open-Meteo Forecast API with `current_weather=true` to retrieve the current temperature and wind.
- The last searched city is saved to localStorage.
- Click the moon and sun icons to toggle between light mode and dark mode.


#### Notes

- This is suitable for demos and avoids shipping any API keys.
- The geocoding API returns best-effort matches; if multiple cities share the same name, the top result is used.
