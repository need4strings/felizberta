import LandingPage from './landingPage.js';
import Google from './google.js';
import Strings from './strings.js';
import Youtube from './youtube.js';
import Movies from './movies.js';
import ApiKeys from './apiKeys.js';
import Cocktails from './cocktails.js';
import Weather from './weather.js';
import Commands from './commands.js';

window.onload = () => {
  const talkBtn = document.getElementById("talk");

  talkBtn.addEventListener("click", () => {
    recognition.start();
  });
  moveDownAnimation();
  fadeInContent();
  LandingPage(Strings);
}

const userLanguage = window.navigator.userLanguage || window.navigator.language;
  console.log('USER LANGUAGE', userLanguage);
  let strings;

  if (userLanguage === "pt-PT") {
    strings = Strings.stringsPt;
  } else {
    strings = Strings.stringsEn;
  }

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
  const result = event.results[0][0].transcript;
  console.log("TU DISSESTE: ", result);
  let resultArr;

  if (result.includes("filme") || result.includes("movie")) {

    if (userLanguage === "pt-PT") {
      resultArr = result.split("filme");
    } else {
      resultArr = result.split("movie");
    }

    Movies(resultArr, ApiKeys, strings, moveDownAnimation, isDown);
  } else if (result.includes("Google")) {
    resultArr = result.split("Google");
    Google(resultArr, strings);
  } else if (result.includes("YouTube")) {
    resultArr = result.split("YouTube");
    Youtube(resultArr, strings);
  } else if (result.includes("tempo")) {
    Weather(fadeInContent, moveDownAnimation, strings);
  } else if (result.includes("cocktails")) {
    Cocktails(isDown, strings, fadeInContent, moveDownAnimation)
      .catch(error => console.log(error));
  } else if (result.includes("comandos")) {
    Commands(strings, fadeInContent, moveDownAnimation);
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
  const homePage = document.getElementById("homePage");
  const commandsPage = document.getElementById("commandsPage");
  result.style.animation = "contentFadeOut 2s forwards";
  homePage.style.animation = "contentFadeOut 2s forwards";
  commandsPage.style.animation = "contentFadeOut 2s forwards";
  console.log('result', result);
  /*$(".cocktailImage").delay(1000).animate({ "opacity": "1" }, 700);*/
}

const fadeInContent = () => {
  const result = document.getElementById("result");
  const homePage = document.getElementById("homePage");
  const commandsPage = document.getElementById("commandsPage");
  commandsPage.style.animation = "contentFadeIn 2s forwards";
  homePage.style.animation = "contentFadeIn 2s forwards";
  result.style.animation = "contentFadeIn 2s forwards";
  console.log('result', result);
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
  console.log("estou a tentar ir para cima")
  const box = document.getElementById("box")
  box.style.animation = "moveUp 2s forwards";
}

//jQuery reminder
/*$('div.result').
 $('.result').html('<h1>rfyghnjmk>/h1>');
 $('.result').append('<div></div>');
 $('.result').after('<div></div>');

//para fazer quando alguém carregar no botão uma seguinte vez
/*$('.result').empty();*/
