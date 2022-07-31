const searchForm = document.querySelector("#searchForm");
const cityElement = document.querySelector("#cityName");
const dateElement = document.querySelector("#date");

const tempElement = document.querySelector("#temp");
const toCelsius = document.querySelector("#toCelsius");
const toFahrenheit = document.querySelector("#toFahrenheit");

const currentLocation = document.querySelector("#current-location");

const apiKey = "b0d417b9a05ce1bce437f53ce8e8f48d";

let temperature = 17;

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

	return `${currentDay}, ${currentDate} ${currentMonth} ${currentYear} -- ${currentHours}:${currentMins} `;
}

const date = new Date();
dateElement.innerHTML = formatDate(date);

const searchCity = (e) => {
	e.preventDefault();
	const city = document.querySelector("#city").value;

	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

	axios.get(apiUrl).then((res) => {
		console.log(res.data);
		tempElement.innerHTML = Math.round(res.data.main.temp);
		cityElement.innerHTML = res.data.name;
	});
};

function searchByLocation(e) {
	e.preventDefault();
	navigator.geolocation.getCurrentPosition((position) => {
		console.log(position);
		let lat = position.coords.latitude;
		let lon = position.coords.longitude;
		console.log(lat, lon);

		const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

		function showTemp(res) {
			console.log(res.data);
			tempElement.innerHTML = Math.round(res.data.main.temp);
			cityElement.innerHTML = res.data.name;
		}
		axios.get(apiUrl).then(showTemp);
	});
}

searchForm.addEventListener("submit", searchCity);
currentLocation.addEventListener("click", searchByLocation);

// Celsius and Fahrenheit Conversion
const celsiusTemperature = Math.round(temperature);
const fahrenheitTemperature = Math.round((temperature * 9) / 5 + 32);

toCelsius.addEventListener("click", () => {
	tempElement.innerHTML = celsiusTemperature;
});

toFahrenheit.addEventListener("click", () => {
	tempElement.innerHTML = fahrenheitTemperature;
});
