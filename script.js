/*
    Weather App (Cek Cuaca) 🌤️
    Created by: [Your Name]
    License: MIT
*/

const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: Light",
    53: "Drizzle: Moderate",
    55: "Drizzle: Dense intensity",
    56: "Freezing Drizzle: Light",
    57: "Freezing Drizzle: Dense intensity",
    61: "Rain: Slight",
    63: "Rain: Moderate",
    65: "Rain: Heavy intensity",
    66: "Freezing Rain: Light",
    67: "Freezing Rain: Heavy intensity",
    71: "Snow fall: Slight",
    73: "Snow fall: Moderate",
    75: "Snow fall: Heavy intensity",
    77: "Snow grains",
    80: "Rain showers: Slight",
    81: "Rain showers: Moderate",
    82: "Rain showers: Violent",
    85: "Snow showers slight",
    86: "Snow showers heavy",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const location = document.getElementById('locationInput').value;
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

    // Fetch latitude and longitude for the location
    fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`)
        .then(response => response.json())
        .then(locationData => {
            if (locationData.length > 0) {
                const latitude = locationData[0].lat;
                const longitude = locationData[0].lon;

                // Initialize or update the map
                if (typeof map === 'undefined') {
                    map = L.map('map').setView([latitude, longitude], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);
                } else {
                    map.setView([latitude, longitude], 13);
                }

                // Add a marker to the map
                L.marker([latitude, longitude]).addTo(map)
                    .bindPopup(`<b>${location}</b>`).openPopup();

                // Fetch weather data using Open-Meteo API
                fetch(apiUrl.replace('{latitude}', latitude).replace('{longitude}', longitude))
                    .then(response => response.json())
                    .then(data => {
                        const weatherResult = document.getElementById('weatherResult');
                        if (data.daily) {
                            const daily = data.daily;
                            let forecastHtml = `<h3 class="col-12 text-center mb-4">7-Day Weather Forecast in ${location}</h3>`;
                            for (let i = 0; i < daily.time.length; i++) {
                                const weatherDescription = weatherDescriptions[daily.weathercode[i]] || "Unknown";
                                forecastHtml += `
                                    <div class="col-md-4 mb-4">
                                        <div class="card weather-card p-3">
                                            <h4 class="card-title">${new Date(daily.time[i]).toDateString()}</h4>
                                            <p class="card-text"><i class="fas fa-temperature-high weather-icon"></i> Max Temperature: ${daily.temperature_2m_max[i]}°C</p>
                                            <p class="card-text"><i class="fas fa-temperature-low weather-icon"></i> Min Temperature: ${daily.temperature_2m_min[i]}°C</p>
                                            <p class="card-text"><i class="fas fa-cloud weather-icon"></i> Condition: ${weatherDescription}</p>
                                        </div>
                                    </div>
                                `;
                            }
                            weatherResult.innerHTML = forecastHtml;
                        } else {
                            weatherResult.innerHTML = `<p class="text-danger">Weather data not available. Please try again.</p>`;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching weather data:', error);
                        document.getElementById('weatherResult').innerHTML = `<p class="text-danger">Error fetching weather data. Please try again later.</p>`;
                    });
            } else {
                document.getElementById('weatherResult').innerHTML = `<p class="text-danger">Location not found. Please try again.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
            document.getElementById('weatherResult').innerHTML = `<p class="text-danger">Error fetching location data. Please try again later.</p>`;
        });
});

let map; // Declare the map variable
