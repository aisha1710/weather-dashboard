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
  pastSearch(searchValue);
  searchCity.val("");
});

searchBtn.on("click", function (event) {
  event.preventDefault();

  var searchValue = searchCity.val().trim();

  currentConditionsRequest(searchValue);
  pastSearch(searchValue);
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
  pastSearch(value);
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
  }).then(function (weather) {
    city.text(weather.name);
    city.append("<small class='text-muted' id='current-date'>");
    $("#current-date").text("(" + currentDate + ")");
    city.append(
      "<img src='https://openweathermap.org/img/w/" +
        weather.weather[0].icon +
        ".png' alt='" +
        weather.weather[0].main +
        "' />"
    );
    temp.text(weather.main.temp);
    temp.append("&deg;F");
    humidity.text(weather.main.humidity + "%");
    windSpeed.text(weather.wind.speed + "MPH");

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;

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
    }).then(function (weather) {
      UVindex.text(weather.value);
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
    }).then(function (weather) {
      $("#five-day-forecast").empty();
      for (var i = 1; i < weather.list.length; i += 8) {
        var forecastDateString = moment(weather.list[i].dt_txt).format("L");
        console.log(forecastDateString);

        var forecastCol = $(
          "<div class='col-12 col-md-6 col-lg forecast-day mb-3'>"
        );
        var card = $("<div class='card'>");
        var cardInput = $("<div class='card-body'>");
        var date = $("<h5 class='card-title'>");
        var iconImage = $("<img>");
        var temperature = $("<p class='card-text mb-0'>");
        var humidity = $("<p class='card-text mb-0'>");

        $("#five-day-forecast").append(forecastCol);
        forecastCol.append(card);
        card.append(cardInput);

        cardInput.append(date);
        cardInput.append(iconImage);
        cardInput.append(temperature);
        cardInput.append(humidity);

        iconImage.attr(
          "src",
          "https://openweathermap.org/img/w/" +
            weather.list[i].weather[0].icon +
            ".png"
        );
        iconImage.attr("alt", weather.list[i].weather[0].main);
        date.text(forecastDateString);
        temperature.text(weather.list[i].main.temp);
        temperature.prepend("Temp: ");
        temperature.append("&deg;F");
        humidity.text(weather.list[i].main.humidity);
        humidity.prepend("Humidity: ");
        humidity.append("%");
      }
    });
  });
}

const pastSearch = (searchValue) => {
  if (searchValue) {
    if (cityList.indexOf(searchValue) === -1) {
      cityList.push(searchValue);

      listArray();
      clearBtn.removeClass("hide");
      weatherContent.removeClass("hide");
    } else {
      var removeIndex = cityList.indexOf(searchValue);
      cityList.splice(removeIndex, 1);

      cityList.push(searchValue);

      listArray();
      clearBtn.removeClass("hide");
      weatherContent.removeClass("hide");
    }
  }
};

function listArray() {
  searchForm.empty();

  cityList.forEach(function (city) {
    var pastSearch = $('<li class="list-group-item city-btn">');
    pastSearch.attr("data-value", city);
    pastSearch.text(city);
    searchForm.prepend(pastSearch);
  });
  localStorage.setItem("cities", JSON.stringify(cityList));
}
