const API_KEY = import.meta.env.VITE_API_KEY;

const Day_Of_The_Week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const END_POINTS = {
  CURRENT_FORECAST_CORD: "https://api.openweathermap.org/data/2.5/weather",
  CURRENT_FORECAST: "https://api.openweathermap.org/data/2.5/weather",
  FIVE_DAY_FORECAST: "https://api.openweathermap.org/data/2.5/forecast",
  GEO_LOCATION: "http://api.openweathermap.org/geo/1.0/direct",
};

//4
const formatTemp = (value) => `${value.toFixed(1)} ℃`;

// ?q={city name}&appid={API key}

const getIcon = (iconCode) =>
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

document.addEventListener("DOMContentLoaded", () => {
  const loadCurrentForecast = async ({ lat, lon }) => {
    //1

    const cityName = import.meta.env.VITE_DEFAULT_CITY || "Chittoor";
    const response =
      lat && lon
        ? await fetch(
            `${END_POINTS.CURRENT_FORECAST_CORD}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          )
        : await fetch(
            `${END_POINTS.CURRENT_FORECAST}?q=${cityName}&appid=${API_KEY}&units=metric`
          );
    // console.log(response.json());

    return response.json();
  };

  //5

  const getHourlyForecast = async (city) => {
    const response = await fetch(
      `${END_POINTS.FIVE_DAY_FORECAST}?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    console.log(data);

    return data.list.map((forecast) => {
      let {
        main: { temp, temp_max, temp_min },
        dt,
        dt_txt,
        weather: [{ description, icon }],
      } = forecast;
      return { temp, temp_max, temp_min, dt, dt_txt, description, icon };
    });
  };

  const formatTime = (time) => {
    let [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  // 3
  const createCurrentForecast = ({
    sys: { country, sunrise, sunset },
    name,
    main: { temp, temp_min, temp_max },
    weather: [{ description, icon }],
  }) => {
    //3
    // <h1>name</h1>
    // <p class="temp">24</p>
    // <p class="description">description</p>
    // <p class="min-max-temp">high low</p>
    const container = document.getElementById("current-forecast");

    container.innerHTML = "";

    const heading = document.createElement("h1");
    heading.textContent = `${name}, ${country}`;

    const temperature = document.createElement("p");
    temperature.classList.add("temp");
    temperature.textContent = formatTemp(temp);

    const descriptionContainer = document.createElement("section");

    const iconElement = document.createElement("img");
    iconElement.src = getIcon(icon);
    iconElement.classList.add("icon");

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("description");
    descriptionElement.textContent = description;

    descriptionContainer.append(iconElement, descriptionElement);
    descriptionContainer.classList.add("description-container");

    const minMaxTemp = document.createElement("p");
    minMaxTemp.classList.add("min-max-temp");
    minMaxTemp.textContent = `Max: ${formatTemp(temp_max)} Min: ${formatTemp(
      temp_min
    )}`;

    container.append(heading, temperature, descriptionContainer, minMaxTemp);
  };

  // 6

  const createHourlyForecast = (hourlyForecast) => {
    let dataFor12Entries = hourlyForecast.slice(1, 13);
    // <article>
    //     <h3 class="time">now</h3>
    //     <p class="icon">icon</p>
    //     <p class="hourly-temp">temp</p>
    // </article>
    const hourlyContainerElement = document.querySelector(
      ".hourly-forecast-container"
    );

    hourlyContainerElement.innerHTML = "";

    for (let { temp, icon, dt_txt } of dataFor12Entries) {
      const container = document.createElement("article");
      container.classList.add("hour-info");

      const time = document.createElement("h3");
      time.textContent = formatTime(dt_txt.split(" ")[1]);
      time.classList.add("time");

      const iconimage = document.createElement("img");
      iconimage.classList.add("icon");
      iconimage.src = getIcon(icon);

      const temperature = document.createElement("p");
      temperature.classList.add("hourly-temp");
      temperature.textContent = formatTemp(temp);

      container.append(time, iconimage, temperature);

      hourlyContainerElement.appendChild(container);
    }
  };

  //8

  const getDay = (dateValue) => Day_Of_The_Week[new Date(dateValue).getDay()];

  //7

  const createFiveDayForecast = (hourlyForecast) => {
    //7
    const result = Object.groupBy(hourlyForecast, (forecast) =>
      getDay(forecast.dt_txt.split(" ")[0])
    );
    console.log(result);

    for (let day in result) {
      let temp_min = Math.min(
        ...Array.from(result[day], ({ temp_min }) => temp_min)
      );
      let temp_max = Math.max(
        ...Array.from(result[day], ({ temp_max }) => temp_max)
      );
      result[day] = { temp_max, temp_min, icon: getIcon(result[day][0].icon) };
    }

    // console.log(result);

    const forecastContainer = document.querySelector(
      ".five-day-forecast-container"
    );

    forecastContainer.innerHTML = "";

    for (let day in result) {
      const dayContainer = document.createElement("article");
      dayContainer.classList.add("day-wise-forecast");

      const dayOfTheWeek = document.createElement("h3");
      dayOfTheWeek.classList.add("day");
      dayOfTheWeek.textContent =
        day === Day_Of_The_Week[new Date().getDay()] ? "Today" : day;
      if (day != Day_Of_The_Week[new Date().getDay()]) {
        const image = document.createElement("img");
        image.src = result[day].icon;
        image.classList.add("icon");

        const minTemp = document.createElement("p");
        minTemp.classList.add("min-temp");
        minTemp.textContent = formatTemp(result[day].temp_min);

        const maxTemp = document.createElement("p");
        maxTemp.classList.add("max-temp");
        maxTemp.textContent = formatTemp(result[day].temp_max);
        dayContainer.append(dayOfTheWeek, image, minTemp, maxTemp);
        forecastContainer.appendChild(dayContainer);
      }
    }
  };

  // 9

  const createFeelsLike = ({ main: { feels_like } }) => {
    const element = document.querySelector("#feels-like .temp");
    element.textContent = formatTemp(feels_like);
  };

  function ssFormatTime(sunriseSunset) {
    let Time = new Date(sunriseSunset * 1000);
    let hours = Time.getHours();
    let mins = Time.getMinutes();

    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    let formattedTime = `${hours}:${mins.toString().padStart(2, "0")}${ampm}`;

    return formattedTime;
  }
  // Last
  const sunriseSunset = ({ sys: { sunrise, sunset } }) => {
    let sunriseTime = ssFormatTime(sunrise);
    let sunsetTime = ssFormatTime(sunset);

    const srelement = document.querySelector("#sunrise > .srTime");
    srelement.textContent = sunriseTime;

    const sselement = document.querySelector("#sunset > .ssTime");
    sselement.textContent = sunsetTime;
    // element.textContent =
  };

  //9

  const createHumidity = ({ main: { humidity } }) => {
    const element = document.querySelector("#humidity .humidity");
    element.textContent = `${humidity}%`;
  };

  const loadData = async (data) => {
    //2
    const currentForecast = await loadCurrentForecast(data);
    console.log(currentForecast);
    createCurrentForecast(currentForecast);

    const hourlyForecast = await getHourlyForecast(currentForecast.name);
    console.log(hourlyForecast);

    //9
    createFeelsLike(currentForecast);
    createHumidity(currentForecast);

    sunriseSunset(currentForecast);
    createHourlyForecast(hourlyForecast);

    createFiveDayForecast(hourlyForecast);
  };

  // 11

  const getGeoLocationInfo = async (cityName) => {
    const response = await fetch(
      `${END_POINTS.GEO_LOCATION}?q=${cityName}&limit=5&appid=${API_KEY}`
    );
    return response.json();
  };

  //13
  const onInput = async (event) => {
    let cityName = event.target.value;
    if (cityName) {
      const cities = await getGeoLocationInfo(cityName);
      const dataList = document.getElementById("cities");
      let options = "";
      for (let { lat, lon, country, name, state } of cities) {
        options += `<option data-coords = ${JSON.stringify({
          lat,
          lon,
        })} value="${name},${state},${country}"></option>`;
      }
      dataList.innerHTML = options;
    }
  };

  function debounce(func, timeout = 800) {
    let timer;
    return (...args) => {
      console.log("debounce called");
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  // 13
  const onSelect = (event) => {
    // console.log(event.target.value);
    let selectedOption = document.querySelector("datalist > option");
    if (selectedOption) {
      // console.log(selectedOption.getAttribute("data-coords"));
      let result = JSON.parse(selectedOption.getAttribute("data-coords"));
      if (result) {
        loadData(result);
      }
    }
  };

  //12
  const searchElement = document.getElementById("search");
  const debounceSearch = debounce((event) => onInput(event));
  searchElement.addEventListener("input", debounceSearch);
  searchElement.addEventListener("change", onSelect);
  // loadData()

  //10
  const loadDataUsingGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lon } }) => {
        // console.log(result);
        loadData({ lat, lon });
      },
      () => {
        alert("Unable to fetch location");
        loadData({});
      }
    );
  };

  loadDataUsingGeoLocation();
  getGeoLocationInfo("Chittoor");
});
