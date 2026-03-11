/**
 * weather.js - 天气 API
 * 调用免费天气接口，展示目的地天气
 */
(function (global) {
  'use strict';

  var cityCoords = {
    '广州': { lat: 23.13, lon: 113.26 },
    '珠海': { lat: 22.27, lon: 113.58 },
    '深圳': { lat: 22.55, lon: 114.05 },
    '北京': { lat: 39.90, lon: 116.40 },
    '上海': { lat: 31.23, lon: 121.47 }
  };

  function getCoord(city) {
    return cityCoords[city] || cityCoords['广州'];
  }

  function getWeatherIcon(code) {
    if (code >= 200 && code < 300) return { icon: '⛈', type: 'storm' };
    if (code >= 300 && code < 400) return { icon: '🌧', type: 'rain' };
    if (code >= 500 && code < 600) return { icon: '🌧', type: 'rain' };
    if (code >= 600 && code < 700) return { icon: '❄', type: 'snow' };
    if (code >= 700 && code < 800) return { icon: '🌫', type: 'fog' };
    if (code === 800) return { icon: '☀', type: 'sunny' };
    if (code > 800) return { icon: '☁', type: 'cloud' };
    return { icon: '🌤', type: 'cloud' };
  }

  async function showWeather(cityName, containerSelector) {
    var container = typeof containerSelector === 'string'
      ? document.querySelector(containerSelector) : containerSelector;
    if (!container) return;

    container.style.display = 'block';
    container.innerHTML = '<p class="weather-loading">加载中...</p>';

    var c = getCoord(cityName);
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + c.lat + '&longitude=' + c.lon +
      '&current=temperature_2m,weather_code&timezone=Asia/Shanghai';

    try {
      var res = await fetch(url);
      var data = await res.json();
      var cur = data.current || {};
      var obj = getWeatherIcon(cur.weather_code || 0);
      var icon = obj.icon;
      var iconType = obj.type || 'cloud';
      var temp = Math.round(cur.temperature_2m || 0);
      container.innerHTML = '<div class="weather-result">' +
        '<span class="weather-icon weather-icon--' + iconType + '" aria-hidden="true">' + icon + '</span>' +
        '<span class="weather-city">' + cityName + '</span>' +
        '<span class="weather-temp">' + temp + '°C</span>' +
        '</div>';
    } catch (e) {
      container.innerHTML = '<p class="weather-error">天气加载失败</p>';
      if (typeof global.Toast !== 'undefined') {
        global.Toast.error('天气加载失败，请稍后重试');
      }
    }
  }

  global.showWeather = showWeather;
})(typeof window !== 'undefined' ? window : this);
