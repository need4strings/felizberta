import LandingPage from './landingPage.js';
import Google from './google.js';
import Strings from './strings.js';
import Youtube from './youtube.js';
import Movies from './movies.js';
import ApiKeys from './apiKeys.js';
import Cocktails from './cocktails.js';
import Weather from './weather.js';
import Commands from './commands.js';
import RandomCat from './randomCat.js';
import RandomMeme from './randomMeme.js';

window.onload = () => {
  const talkBtn = document.getElementById("talk");

  talkBtn.addEventListener("click", () => {
    recognition.start();
  });
  moveDownAnimation();
  fadeInContent();
  LandingPage(Strings);
}

const checkLanguage = () => {

  const userLanguage = window.navigator.userLanguage || window.navigator.language;
  let strings;

  if (userLanguage === "pt-PT") {
    strings = Strings.stringsPt;
  } else {
    strings = Strings.stringsEn;
  }
  
  return strings;
}

const strings = checkLanguage();

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;
const recognition = new SpeechRecognition();
let isDown = false;

recognition.onstart = () => {
  clearResult();
  startAnimation();
  clearResult();
}

/* Deal with voice command */
recognition.onresult = (event) => {
  stopAnimation();

  const result = event.results[0][0].transcript;
  console.log("YOU SAID: ", result);
  let resultArr;

  if (result.includes("filme") || result.includes("movie")) {
    if (userLanguage === "pt-PT") {
      resultArr = result.split("filme");
    } else {
      resultArr = result.split("movie");
    }

    Movies(resultArr, ApiKeys, strings, moveDownAnimation, isDown, speak);
  } else if (result.includes("Google")) {
    resultArr = result.split("Google");
    Google(resultArr, strings, speak);
  } else if (result.includes("YouTube")) {
    resultArr = result.split("YouTube");
    Youtube(resultArr, strings, speak);
  } else if (result.includes("tempo")) {
    Weather(fadeInContent, moveDownAnimation, strings, speak);
  } else if (result.includes("cocktails")) {
    console.log("COCKKKDKDKCKSDFKJ", Cocktails);
    Cocktails.dealWithSuggestedCocktails(isDown, strings, fadeInContent, moveDownAnimation, speak)
      .catch(error => console.log(error));
  } else if (result.includes("comandos")) {
    Commands(strings, fadeInContent, moveDownAnimation, speak);
  } else if (result.includes("home")) {
    location.reload();
  } else if (result.includes("gato qualquer")) {
    RandomCat(strings, fadeInContent, moveDownAnimation, speak);
  } else if (result.includes("piada")) {
    RandomMeme(strings, fadeInContent, moveDownAnimation, speak);
  } else {
    speak(strings.felizberta_ask_to_repeat);
    new SpeechRecognition();
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
  const homeButton = document.getElementById("homeButton");
  homeButton.style.display = "none";
}

const fadeOutContent = () => {
  const result = document.getElementById("result");
  const homePage = document.getElementById("homePage");
  const commandsPage = document.getElementById("commandsPage");
  result.style.animation = "contentFadeOut 2s forwards";
  homePage.style.animation = "contentFadeOut 2s forwards";
  commandsPage.style.animation = "contentFadeOut 2s forwards";
  /*$(".cocktailImage").delay(1000).animate({ "opacity": "1" }, 700);*/
}

const fadeInContent = () => {
  const result = document.getElementById("result");
  const homePage = document.getElementById("homePage");
  const commandsPage = document.getElementById("commandsPage");
  commandsPage.style.animation = "contentFadeIn 2s forwards";
  homePage.style.animation = "contentFadeIn 2s forwards";
  result.style.animation = "contentFadeIn 2s forwards";
  /*$(".cocktailImage").delay(1000).animate({ "opacity": "1" }, 700);*/
}

const clearResult = () => {
  if (isDown) {
    fadeOutContent();

    setTimeout(() => {
      $('.result').empty()
      $('.homePage').empty()
      $('.commandsPage').empty()
    }, 2000);

    moveUpAnimation();
  }
}

const moveUpAnimation = () => {
  const box = document.getElementById("box")
  box.style.animation = "moveUp 2s forwards";
  const homeButton = document.getElementById("homeButton");
  homeButton.onclick = goHome;
  homeButton.style.display = "block";
}

const speak = (toBeSaid) => {
  const utterance = new SpeechSynthesisUtterance(toBeSaid);
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

const goHome = () => {
  location.reload();
}



function readResponseAsBlob(response) {
  return response.blob();
}


async function presentMovies(fetchedArray, trailer) { 
  console.log("present this", fetchedArray)
  console.log("now present this", trailer)
 
}



//fetchPoster('examples/kitten.jpg');




//jQuery reminder
/*$('div.result').
 $('.result').html('<h1>rfyghnjmk>/h1>');
 $('.result').append('<div></div>');
 $('.result').after('<div></div>');

//para fazer quando alguém carregar no botão uma seguinte vez
/*$('.result').empty();*/
