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
