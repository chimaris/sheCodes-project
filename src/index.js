const searchForm = document.querySelector("#searchForm");
const cityElement = document.querySelector("#cityName");
const dateElement = document.querySelector("#date");
const iconElement = document.querySelector("#weather-icon");
const descriptionElement = document.querySelector("#weather-description");
const updatedTimeElement = document.querySelector("#updated-time");
const pressureElement = document.querySelector("#pressure");
const feelsLikeElement = document.querySelector("#feels-like");
const humidityElement = document.querySelector("#humidity");
const speedElement = document.querySelector("#speed");

const forecastSectionElement = document.querySelector("#forecast-section");

const tempElement = document.querySelector("#temp");
const toCelsius = document.querySelector("#toCelsius");
const toFahrenheit = document.querySelector("#toFahrenheit");

const currentLocation = document.querySelector("#current-location");

const apiKey = "b0d417b9a05ce1bce437f53ce8e8f48d";

let temperature;

function formatDate(date) {
	const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	let currentYear = date.getFullYear();
	let currentDay = days[date.getDay()];
	let currentMonth = months[date.getMonth()];
	let currentDate = date.getDate();
	let currentHours = date.getHours();
	let currentMins = date.getMinutes();

	if (currentHours < 10) {
		currentHours = `0${currentHours}`;
	}
	if (currentMins < 10) {
		currentMins = `0${currentMins}`;
	}

	return `<strong>Date:</strong> ${currentDay}, ${currentDate} ${currentMonth} ${currentYear} | <strong>Time:</strong>  ${currentHours}:${currentMins} `;
}

const date = new Date();
dateElement.innerHTML = formatDate(date);

function formatTime(time) {
	console.log(time);
	let date = new Date(time);
	let currentHours = date.getHours();
	let currentMins = date.getMinutes();

	if (currentHours < 10) {
		currentHours = `0${currentHours}`;
	}
	if (currentMins < 10) {
		currentMins = `0${currentMins}`;
	}

	return `${currentHours}:${currentMins} `;
}

function formatDay(day) {
	let date = new Date(day);
	const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

	let currentDay = days[date.getDay()];
	return currentDay;
}

function dailyForecast(lat, lon) {
	const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&cnt=${6}&appid=${apiKey}`;
	forecastSectionElement.innerHTML = "";
	axios.get(apiUrl).then((res) => {
		console.log(res.data.daily);

		res.data.daily.forEach((forecast, index) => {
			if (index < 6) {
				forecastSectionElement.innerHTML += `
				<div class="col-2 day-div">
					<h3>
						<span class="day">${formatDay(forecast.dt * 1000)}</span> <br /> 
						<span>${Math.round(forecast.temp.max)}<sup>o</sup>/${Math.round(forecast.temp.min)}<sup>o</sup></span>
					</h3>
					<img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" width="50%" />
				</div>`;
			}
		});
	});
}

const searchCity = (e) => {
	e.preventDefault();
	const city = document.querySelector("#city").value;

	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

	axios.get(apiUrl).then((res) => {
		console.log(res.data);
		temperature = res.data.main.temp;
		tempElement.innerHTML = Math.round(temperature);
		cityElement.innerHTML = res.data.name;
		iconElement.src = `http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`;
		descriptionElement.innerHTML = res.data.weather[0].description;
		updatedTimeElement.innerHTML = formatTime(res.data.dt * 1000);

		dailyForecast(res.data.coord.lat, res.data.coord.lon);
	});
};

function searchByLocation() {
	navigator.geolocation.getCurrentPosition((position) => {
		console.log(position);
		let lat = position.coords.latitude;
		let lon = position.coords.longitude;
		console.log(lat, lon);

		const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

		function showTemp(res) {
			console.log(res.data);
			temperature = res.data.main.temp;
			tempElement.innerHTML = Math.round(temperature);
			cityElement.innerHTML = res.data.name;
			iconElement.src = `http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`;
			descriptionElement.innerHTML = res.data.weather[0].description;
			updatedTimeElement.innerHTML = formatTime(res.data.dt * 1000);
			pressureElement.innerHTML = res.data.main.pressure;
			feelsLikeElement.innerHTML = Math.round(res.data.main.feels_like);
			humidityElement.innerHTML = res.data.main.humidity;
			speedElement.innerHTML = Math.round(res.data.wind.speed);
		}
		axios.get(apiUrl).then(showTemp);

		dailyForecast(lat, lon);
	});
}

searchByLocation();

function searchByLocationHandler(e) {
	e.preventDefault();

	searchByLocation();
}

searchForm.addEventListener("submit", searchCity);
currentLocation.addEventListener("click", searchByLocationHandler);

// Celsius and Fahrenheit Conversion
toCelsius.addEventListener("click", () => {
	tempElement.innerHTML = Math.round(temperature);
	toCelsius.classList.remove("active");
	toFahrenheit.classList.add("active");
});

toFahrenheit.addEventListener("click", () => {
	tempElement.innerHTML = Math.round((temperature * 9) / 5 + 32);
	toFahrenheit.classList.remove("active");
	toCelsius.classList.add("active");
});
