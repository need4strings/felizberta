/* Deal with weather request */
const dealWithWeather = (fadeInContent, moveDownAnimation, strings, speak) => {
  console.log("TEMOS TEMPO");

  $('div.result').append(`
    <div class="container">
      <div id="widget" class="widget">
        <div class="details">
          <div class="temperature">
            <div class="temperatureDegree">F</div>
          </div>
          <div class="summary">
            <p class="summaryText"></p>
          </div>
          <div class="precipitation"></div>
          <div class="wind"></div>
          <div class="summaryTomorrow">
            <p class="summaryTomorrowText"></p>
          </div>
      </div>
      <canvas class="icon"></canvas>
    </div>`
  );

  const temperatureDescription = document.querySelector(
    ".summaryText"
  );
  const temperatureDegree = document.querySelector(".temperature");
  const precipitation = document.querySelector(".precipitation");
  const wind = document.querySelector(".wind");
  const temperatureSpan = document.querySelector(".temperatureDegree");
  console.log("span", temperatureSpan);
  const temperatureTomorrowDescription = document.querySelector(".summaryTomorrowText");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const long = position.coords.longitude;
      const lat = position.coords.latitude;
      const proxy = "https://cors-anywhere.herokuapp.com/";
      const api = `${proxy}https://api.darksky.net/forecast/eb9d28c07b047831e664f8c758a456e1/${lat},${long}`;

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          fadeInContent();
          moveDownAnimation();
          console.log("ISTOOOOOO: ", data);
          console.log("THISSSSSSSSSSSS: ", temperatureTomorrowDescription);
          const { temperature, summary, icon, precipIntensity, windSpeed } = data.currently;
          //Formula for Celsius
          let celsius = (temperature - 32) * (5 / 9);

          //Set DOM Elements from the API
          temperatureDegree.textContent = Math.floor(celsius) + "°";
          temperatureDescription.textContent = "Today: " + summary;
          precipitation.textContent = "Precipitation: " + precipIntensity + "%";
          wind.textContent = "Wind: " + windSpeed + "km/h";
          temperatureTomorrowDescription.textContent = "Tomorrow: " + data.daily.data[1].summary;

          const widget = document.getElementById("widget");

          //Felizberta Speak
          if (celsius > 25) {
            widget.style.background = "linear-gradient(to bottom right, #ffad7d 20%, #c73002)";
            speak(strings.temperatureHot);
          } else if (celsius < 20 && celsius > 10) {
            widget.style.background = "linear-gradient(to bottom right, #ffe282 20%, #f3c703)";
            speak(strings.temperatureMild);
          } else if (celsius < 10) {
            widget.style.background = "linear-gradient(to bottom right, #82d7ff 20%, #0393f3)";
            speak(strings.temperatureCold);
          } else {
            speak(strings.temperatureNormal);
          }

          // Set Icon
          setWeatherIcons(icon, document.querySelector(".icon"));
          //Change Temperature to Celsius/Farenheit
          temperatureDegree.addEventListener("click", () => {
            if (temperatureSpan.textContent === "F") {
              temperatureSpan.textContent = "C";
              temperatureDegree.textContent = Math.floor(celsius) + "°";
            } else {
              temperatureSpan.textContent = "F";
              temperatureDegree.textContent = Math.floor(temperature) + "°";
            }
          });
        })
        .catch(error => {
          console.log(error);
          speak(strings.api_error)
        });
    });
  } else {
    h1.textContent = "Enable Geolocation to proceed";
  }
}

const setWeatherIcons = (icon, iconId) => {
  console.log('SETTING ICON: ', icon);
  const skycons = new Skycons({ color: "white" });
  const currentIcon = icon.replace(/-/g, "_").toUpperCase();
  skycons.play();
  return skycons.set(iconId, Skycons[currentIcon]);
}

export default dealWithWeather;