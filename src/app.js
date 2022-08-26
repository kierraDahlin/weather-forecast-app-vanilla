function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

// forecast
function formatForecast(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="forecast-item">
            <img
              src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              alt="Weather icon"
            />
            <h3><span class="high">${Math.round(
              forecastDay.temp.max
            )}°</span> | <span class="low">${Math.round(
          forecastDay.temp.min
        )}°</span></h3>
            <h4>${formatForecast(forecastDay.dt)}</h4>
      </div>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}
//

function getForecast(coordinates) {
  // I had to use a different api key from the shecodes team that they gave me
  let apiKey = "a43564c91a6c605aeb564c9ed02e3858";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemp(response) {
  let tempElement = document.querySelector("#curr-temp");
  tempElement.innerHTML = Math.round(response.data.main.temp);

  let cityElement = document.querySelector("#curr-city");
  cityElement.innerHTML = response.data.name;

  let descElement = document.querySelector("#curr-description");
  descElement.innerHTML = response.data.weather[0].description;

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;

  let lowElement = document.querySelector("#low-temp");
  lowElement.innerHTML = Math.round(response.data.main.temp_max);

  let highElement = document.querySelector("#high-temp");
  highElement.innerHTML = Math.round(response.data.main.temp_min);

  let dateElement = document.querySelector("#curr-date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  // get lat and long
  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "cac27e453346e9164edaf605b6536f2f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemp);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-input");
  search(cityInput.value);
}

function changeUnits(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#curr-temp");
  let temp = tempElement.innerHTML;
  temp = Number(temp);
  if (unitsSpan.innerHTML === "C") {
    tempElement.innerHTML = Math.round((temp * 9) / 5 + 32);
    unitsSpan.innerHTML = "F";
  } else {
    tempElement.innerHTML = Math.round(((temp - 32) * 5) / 9);
    unitsSpan.innerHTML = "C";
  }
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let unitsSpan = document.querySelector("#units");
let unitsBtn = document.querySelector("#units-btn");
unitsBtn.addEventListener("click", changeUnits);

search("Westlock");
