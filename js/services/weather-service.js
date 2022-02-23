"use strict";

export const weatherService = {
  getWeather,
};

var x = getWeather(31, 35);
console.log(x);

function getWeather(lat, lng) {
  lat = 31;
  lng = 35;
  const API_WEATHER_KEY = `3b8466b956eb07b8b00cdb1acba5895b`;
  const waetherUrl = `api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_WEATHER_KEY}`;
  console.log(waetherUrl);
  const prm = axios
    .get(waetherUrl)
    .then((res) => {
      var weather = _createWeatherObj(
        res.data.weather.main,
        res.data.weather.description,
        res.data.main.temp,
        res.data.main.feels_like
      );
      console.log(weather);
      return weather;
    })
    .catch((err) => {
      console.log(err, "oops");
    });
  return prm;
//   &units=metric
}

function _createWeatherObj(main, description, temp, feels_like) {
  return {
    main,
    description,
    temp,
    feels_like,
  };
}
