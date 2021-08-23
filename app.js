window.onload = () => {
  const talkBtn = document.getElementById("talk");

  talkBtn.addEventListener("click", () => {
    recognition.start();
  });
}

const userLanguage = window.navigator.userLanguage || window.navigator.language;
const tmdbApiKey = "9c1056f24930eda7a00e44206ef692d9";
const googleSearchApiKey = "AIzaSyB4goZy0s0ULExCk1IKGt3EZtuVlwZL4nw";
const weatherApiKey = "76fa95835f831b9bfd4c896318bce593";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;
const recognition = new SpeechRecognition();
let isDown = false;

recognition.onstart = () => {
  
  clearResult();
  startAnimation();
  console.log("voice activated, you can speak");
  clearResult();
}

/* Deal with voice command */
recognition.onresult = (event) => {
  stopAnimation();

  console.log('EVENNT: ', event);
  console.log('USER LANGUAGE: ', userLanguage);
  const result = event.results[0][0].transcript;
  console.log("TU DISSESTE: ", result);
  let resultArr;

  if (result.includes("filme") || result.includes("movie")) {

    if (userLanguage === "pt-PT") {
      resultArr = result.split("filme");
    } else {
      resultArr = result.split("movie");
    }

    dealWithMovie(resultArr);
  } else if (result.includes("Google")) {
    resultArr = result.split("Google");
    dealWithSearch(resultArr);
  } else if (result.includes("YouTube")) {
    resultArr = result.split("YouTube");
    dealWithYoutube(resultArr);
  } else if (result.includes("tempo")) {
    dealWithWeather();
  } else if (result.includes("cocktails")) {
    dealWithSuggestedCocktails()
      .catch(error => console.log(error));
  }
}

/* Start Animation */
const startAnimation = () => {
  const outline = document.getElementById("delayed");
  outline.style.animation = "pulse 3s ease-out infinite";
}

/* Stop animation */
const stopAnimation = () => {
  const outline = document.getElementById("delayed");
  outline.style.animation = "";
}

/*Start movingDown animation*/
const moveDownAnimation = () => {
  isDown = true;
  const box = document.getElementById("box")
  box.style.animation = "moveDown 2s forwards";
}

const fadeOutContent = () => {
  const result = document.getElementById("result");
  result.style.animation = "contentFadeOut 2s forwards";
  console.log('result', result);
  /*$(".cocktailImage").delay(1000).animate({ "opacity": "1" }, 700);*/
}

const fadeInContent = () => {
  const result = document.getElementById("result");
  result.style.animation = "contentFadeIn 2s forwards";
  console.log('result', result);
  /*$(".cocktailImage").delay(1000).animate({ "opacity": "1" }, 700);*/
}

/* Deal with movies */
const dealWithMovie = (resultArr) => {
  console.log('TENHO FILME');
  const movie = resultArr[1];
  console.log("MOVIE: ", movie);

  fetch("https://api.themoviedb.org/3/search/movie?api_key=" + tmdbApiKey + "&language=en-US&query=" + movie + "&page=1&include_adult=false")
    .then(response => response.json())
    .then(data => {
      const utterance = new SpeechSynthesisUtterance(foundMovie + movie + bro);
      utterance.rate = 1;
      speechSynthesis.speak(utterance);
      console.log("DATA: ", data)
      dealWithMovieTrailer(data.results[0].id);
      moveDownAnimation();
      isDown = true;
    })
    .catch(error => console.log(error))
}

/* Deal with movie trailer */
const dealWithMovieTrailer = (movieId) => {
  fetch("https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=" + tmdbApiKey + "&language=en-US")
    .then(response => response.json())
    .then(data => {
      console.log("TRAILER: ", data);
      const trailer = data.results[0].key;
      // we have to put this ^ in our iframe when presenting the results;
    })
    .catch(error => console.log(error));
}

/* Deal with Google search */
const dealWithSearch = (resultArr) => {
  const searchFor = resultArr[1];
  const utterance = new SpeechSynthesisUtterance(searchGoogle + searchFor + bro);
  utterance.rate = 1;
  speechSynthesis.speak(utterance);

  window.open("https://www.google.com/search?q=" + searchFor, '_blank');
}

/* Deal with YouTube search */
const dealWithYoutube = (resultArr) => {
  const searchFor = resultArr[1];
  const utterance = new SpeechSynthesisUtterance(searchYoutube + searchFor + bro);
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
  window.open("https://www.youtube.com/results?search_query=" + searchFor, '_blank');
}

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

const clearResult = () => {
  if (isDown) {
    fadeOutContent();
    
    setTimeout(() => {
      $('.result').empty()
    }, 2000);

    moveUpAnimation();
  }
}

const moveUpAnimation = () => {
  console.log("estou a tentar ir para cima")
  const box = document.getElementById("box")
  box.style.animation = "moveUp 2s forwards";
}

/* Deal with a request for suggested cocktails */
async function dealWithSuggestedCocktails() {
  let fetchedArray = await fetchCocktails();

  let utterance = new SpeechSynthesisUtterance(cocktails + bro);
  utterance.rate = 1;
  speechSynthesis.speak(utterance);

  setTimeout(() => { 
    utterance = new SpeechSynthesisUtterance(alcohol);
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  }, 1000);

  fadeInContent();
  moveDownAnimation();
  

  const presented = await presentCocktails(fetchedArray);

  //alternativa a tentar
  /*fetchCocktails()
    .then(result => {
      presentCocktails(result);
    })
    .catch(error => console.log(error));*/
}

/*fetch function for suggested cocktails */
async function fetchCocktails() {
  let myRequest = new Request('https:thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail');
  let response = await fetch(myRequest);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  isDown = true;
  let json = await response.json();
  let chosen6Cocktails = choose6Cocktails(json);

  return chosen6Cocktails;
}

/*function to select 6 random cocktails*/
function choose6Cocktails(fetchedArray) {
  let totalCocktailsToPresent = 6;
  let chosen6Cocktails = [];
  let randomIndex;

  for (let i = 0; i < totalCocktailsToPresent; i++) {
    //falta verificação para evitar que possam ser indexes iguais
    randomIndex = Math.floor(Math.random() * 100);
    chosen6Cocktails.push(fetchedArray.drinks[randomIndex]);
  }
  console.log('chosen 6', chosen6Cocktails);

  return chosen6Cocktails;
}

/*function to present 6 random suggested cocktails*/
function presentCocktails(fetchedArray) {
  let cocktailName;
  let cocktailImage;

  for (let i = 0; i < fetchedArray.length; i++) {
    cocktailImage = fetchedArray[i].strDrinkThumb;
    cocktailName = fetchedArray[i].strDrink;
    //$('div.result').append(`<h2 style = "color:white">${cocktailName} </h2>`);
    $('div.result').append(`<div id="cocktailImage" class="cocktailImage"><img id="cocktail" src="${cocktailImage}" 
    onclick = "fetchCocktailById(${fetchedArray[i].idDrink})" style = "cursor:pointer"></div>`);
  }
}

//function to fetch details after a click event on an individual cocktail image
function fetchCocktailById(id) {

}

//jQuery reminder
/*$('div.result').
 $('.result').html('<h1>rfyghnjmk>/h1>');
 $('.result').append('<div></div>');
 $('.result').after('<div></div>');

//para fazer quando alguém carregar no botão uma seguinte vez
/*$('.result').empty();*/
