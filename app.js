import LandingPage from './pages/landingPage.js';
import Google from './pages/google.js';
import Strings from './strings.js';
import Youtube from './pages/youtube.js';
import Movies from './pages/movies.js';
import ApiKeys from './apiKeys.js';
import Cocktails from './pages/cocktails.js';
import Weather from './pages/weather.js';
import Commands from './pages/commands.js';
import RandomCat from './pages/randomCat.js';
import RandomMeme from './pages/randomMeme.js';

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

/* Check user language */
const strings = checkLanguage();

const userLanguage = window.navigator.userLanguage || window.navigator.language;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;
const recognition = new SpeechRecognition();
let isDown = false;

/* Start voice recognition */
recognition.onstart = () => { 
  clearResult();
  startAnimation();
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

    Movies(resultArr, ApiKeys, strings, speak, moveDownAnimation, fadeInContent, clearResult);
  } else if (result.includes("Google")) {
    resultArr = result.split("Google");
    Google(resultArr, strings, speak);
  } else if (result.includes("YouTube")) {
    resultArr = result.split("YouTube");
    Youtube(resultArr, strings, speak);
  } else if (result.includes("tempo") || result.includes("weather")) {
    Weather(fadeInContent, moveDownAnimation, strings, speak);
  } else if (result.includes("cocktails")) {
    Cocktails.dealWithSuggestedCocktails(isDown, strings, fadeInContent, moveDownAnimation, speak)
      .catch(error => console.log(error));
  } else if (result.includes("comandos") || result.includes("commands")) {
    Commands(strings, fadeInContent, moveDownAnimation, speak);
  } else if (result.includes("home")) {
    location.reload();
  } else if (result.includes("gato qualquer") || result.includes("random cat")) {
    RandomCat(strings, fadeInContent, moveDownAnimation, speak);
  } else if (result.includes("piada") || result.includes("joke")) {
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

/* Start movingDown animation */
const moveDownAnimation = () => {
  isDown = true;
  const box = document.getElementById("box")
  box.style.animation = "moveDown 2s forwards";
  const homeButton = document.getElementById("homeButton");
  homeButton.style.display = "none";
}

/* Fade out previous content */
const fadeOutContent = () => {
  const result = document.getElementById("result");
  const homePage = document.getElementById("homePage");
  const commandsPage = document.getElementById("commandsPage");
  result.style.animation = "contentFadeOut 2s forwards";
  homePage.style.animation = "contentFadeOut 2s forwards";
  commandsPage.style.animation = "contentFadeOut 2s forwards";
}

/* Fade in new content */
const fadeInContent = () => {
  const result = document.getElementById("result");
  const homePage = document.getElementById("homePage");
  const commandsPage = document.getElementById("commandsPage");
  commandsPage.style.animation = "contentFadeIn 2s forwards";
  homePage.style.animation = "contentFadeIn 2s forwards";
  result.style.animation = "contentFadeIn 2s forwards";
}

/* Clear result div */
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

/* Move the talk button up */
const moveUpAnimation = () => {
  const box = document.getElementById("box")
  box.style.animation = "moveUp 2s forwards";
  const homeButton = document.getElementById("homeButton");
  homeButton.onclick = goHome;
  homeButton.style.display = "block";
}

/* Make FELIZBERTA speak */
const speak = (toBeSaid) => {
  const utterance = new SpeechSynthesisUtterance(toBeSaid);
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

/* Go back home */
const goHome = () => {
  location.reload();
}