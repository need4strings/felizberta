/* Deal with weather request */
const dealWithWeather = () => {
  console.log("TEMOS TEMPO");

  $('div.result').append(`
    <div class="container">
      <div class="widget">
        <div class="details">
          <div class="temperature">
            <div>F</div>
          </div>
          <div class="summary">
            <p class="summaryText"></p>
          </div>
          <div class="precipitation"></div>
          <div class="wind"></div>
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
  const temperatureSpan = document.querySelector(".temperature div");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const long = position.coords.longitude;
      const lat = position.coords.latitude;
      const api = `https://api.darksky.net/forecast/eb9d28c07b047831e664f8c758a456e1/${lat},${long}`;

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          fadeInContent();
          moveDownAnimation();
          console.log(data);
          const { temperature, summary, icon, precipIntensity, windSpeed } = data.currently;

          //Set DOM Elements from the API
          temperatureDegree.textContent = Math.floor(temperature) + "°";
          temperatureDescription.textContent = "Today: " + summary;
          precipitation.textContent = "Precipitation: " + precipIntensity + "%";
          wind.textContent = "Wind: " + windSpeed + "km/h";

          //Formula for Celsius
          let celsius = (temperature - 32) * (5 / 9);
          console.log("CELSIUS", Math.floor(celsius));

          //Felizberta Speak
          let utterance;
          if (celsius > 25) {
            console.log('HEHE');
            utterance = new SpeechSynthesisUtterance(temperatureHot);
          } else if (celsius < 20 && celsius > 10) {
            console.log('HOHO')
            utterance = new SpeechSynthesisUtterance(temperatureMild);
          } else if (celsius < 10) {
            utterance = new SpeechSynthesisUtterance(temperatureCold);
          } else {
            utterance = new SpeechSynthesisUtterance(temperatureNormal);
          }
          console.log('UTTERANCE: ', utterance);
          utterance.rate = 1;
          speechSynthesis.speak(utterance);

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