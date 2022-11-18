var searchForm = $("#search-form");
var searchCity = $("#city");
var searchBtn = $("#search-btn");
var clearBtn = $("#clear-history");

var city = $("#current-city");
var temp = $("#temp");
var humidity = $("#humidity");
var windSpeed = $("#wind-speed");
var UVindex = $("#uv-index");

var weatherContent = $("#weather-container");

var currentDate = moment().format("L");
$("#current-date").text("(" + currentDate + ")");

var cityList = [];
const history = () => {
  if (localStorage.getItem("cities")) {
    cityList = JSON.parse(localStorage.getItem("cities"));
    var lastIndex = cityList.length - 1;

    listArray();

    if (cityList.length !== 0) {
      currentConditionsRequest(cityList[lastIndex]);
      weatherContent.removeClass("hide");
    }
  }
};
history();
const showClear = () => {
  if (searchForm.text() !== "") {
    clearBtn.removeClass("hide");
  }
};
showClear();

$(document).on("submit", function () {
  event.preventDefault();

  var searchValue = searchCity.val().trim();

  currentConditionsRequest(searchValue);
  searchHistory(searchValue);
  searchCity.val("");
});

searchBtn.on("click", function (event) {
  event.preventDefault();

  var searchValue = searchCity.val().trim();

  currentConditionsRequest(searchValue);
  searchHistory(searchValue);
  searchCity.val("");
});

clearBtn.on("click", function () {
  cityList = [];
  listArray();

  $(this).addClass("hide");
});

searchForm.on("click", "li.city-btn", function (event) {
  var value = $(this).data("value");
  currentConditionsRequest(value);
  searchHistory(value);
});

function currentConditionsRequest(searchValue) {
  var apiKey = "a8e2fed9c9cb00f16c0fb3e6100369d8";
  var apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchValue +
    "&units=imperial&appid=" +
    apiKey;

  $.ajax({
    url: apiURL,
    method: "GET",
  }).then(function (response) {
    city.text(response.name);
    city.append("<small class='text-muted' id='current-date'>");
    $("#current-date").text("(" + currentDate + ")");
    city.append(
      "<img src='https://openweathermap.org/img/w/" +
        response.weather[0].icon +
        ".png' alt='" +
        response.weather[0].main +
        "' />"
    );
    temp.text(response.main.temp);
    temp.append("&deg;F");
    humidity.text(response.main.humidity + "%");
    windSpeed.text(response.wind.speed + "MPH");

    var lat = response.coord.lat;
    var lon = response.coord.lon;

    var UVurl =
      "https://api.openweathermap.org/data/2.5/uvi?&lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey;

    $.ajax({
      url: UVurl,
      method: "GET",
    }).then(function (response) {
      UVindex.text(response.value);
    });

    var forecastURL =
      "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" +
      apiKey +
      "&lat=" +
      lat +
      "&lon=" +
      lon;

    $.ajax({
      url: forecastURL,
      method: "GET",
    }).then(function (response) {
      $("#five-day-forecast").empty();
      for (var i = 1; i < response.list.length; i += 8) {
        var forecastDateString = moment(response.list[i].dt_txt).format("L");
        console.log(forecastDateString);

        var forecastCol = $(
          "<div class='col-12 col-md-6 col-lg forecast-day mb-3'>"
        );
        var forecastCard = $("<div class='card'>");
        var forecastCardBody = $("<div class='card-body'>");
        var forecastDate = $("<h5 class='card-title'>");
        var forecastIcon = $("<img>");
        var forecastTemp = $("<p class='card-text mb-0'>");
        var forecastHumidity = $("<p class='card-text mb-0'>");

        $("#five-day-forecast").append(forecastCol);
        forecastCol.append(forecastCard);
        forecastCard.append(forecastCardBody);

        forecastCardBody.append(forecastDate);
        forecastCardBody.append(forecastIcon);
        forecastCardBody.append(forecastTemp);
        forecastCardBody.append(forecastHumidity);

        forecastIcon.attr(
          "src",
          "https://openweathermap.org/img/w/" +
            response.list[i].weather[0].icon +
            ".png"
        );
        forecastIcon.attr("alt", response.list[i].weather[0].main);
        forecastDate.text(forecastDateString);
        forecastTemp.text(response.list[i].main.temp);
        forecastTemp.prepend("Temp: ");
        forecastTemp.append("&deg;F");
        forecastHumidity.text(response.list[i].main.humidity);
        forecastHumidity.prepend("Humidity: ");
        forecastHumidity.append("%");
      }
    });
  });
}
