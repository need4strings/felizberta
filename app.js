window.onload = () => {
  const talkBtn = document.getElementById("talk");
  const content = document.querySelector(".content");

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

    dealWithMovie(resultArr)
  } else if (result.includes("Google")) {
    resultArr = result.split("Google");
    dealWithSearch(resultArr);
  } else if (result.includes("YouTube")) {
    resultArr = result.split("YouTube");
    dealWithYoutube(resultArr);
  } else if (result.includes("tempo em")) {
    resultArr = result.split("tempo em");
    dealWithWeather(resultArr);
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

/* Deal with movies */
const dealWithMovie = (resultArr) => {
  console.log('TENHO FILME');
  const movie = resultArr[1];
  const IMGPATH = "https://image.tmdb.org/t/p/w1280";
  const result = document.getElementById("result");
  console.log("MOVIE: ", movie);

  fetch("https://api.themoviedb.org/3/search/movie?api_key=" + tmdbApiKey + "&language=en-US&query=" + movie + "&page=1&include_adult=false")
    .then(response => response.json())
    .then(async data => {
      const utterance = new SpeechSynthesisUtterance("Encontrei isto para o filme " + movie + " meu brou");
      utterance.rate = 1;
      speechSynthesis.speak(utterance);
      console.log("DATA: ", data)
      const trailer = await dealWithMovieTrailer(data.results[0].id);
      console.log('TRAILER: ', trailer)
      data.results.forEach(element => {
        // Creating elemnts for our data inside the main tag. 
        const el = document.createElement('div');
        const image = document.createElement('img');
        const text = document.createElement('h2');
    
        text.innerHTML = `${element.title}`;
        image.src = IMGPATH + element.poster_path;
        el.appendChild(image);
        el.appendChild(text);
        result.appendChild(el);
      });
      

      moveDownAnimation();
      isDown = true;

    })
    .catch(error => console.log(error))
}

/* Deal with movie trailer */
const dealWithMovieTrailer = async (movieId) => {
  return fetch("https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=" + tmdbApiKey + "&language=en-US")
    .then(response => response.json())
    .then(data => {
      console.log("TRAILER: ", data);
      return data.results[0].key;
      // we have to put this ^ in our iframe when presenting the results;
    })
    .catch(error => console.log(error));
}

/* Deal with Google search */
const dealWithSearch = (resultArr) => {
  console.log('TENHO PESQUISA');
  const searchFor = resultArr[1];
  console.log('VOU PROCURAR POR: ', searchFor);

  window.open("https://www.google.com/search?q=" + searchFor, '_blank');
}

/* Deal with YouTube search */
const dealWithYoutube = (resultArr) => {
  console.log("TEMOS YOUTUBE");
  const searchFor = resultArr[1];
  console.log("VOU PROCURAR POR: ", searchFor);
  window.open("https://www.youtube.com/results?search_query=" + searchFor, '_blank');
}

/* Deal with weather request */
const dealWithWeather = (resultArr) => {
  console.log("TEMOS TEMPO");
  const searchFor = resultArr[1];
  console.log("VOU PROCURAR COMO ESTÁ O TEMPO EM: ", searchFor);
  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + searchFor + "&appid=" + weatherApiKey)
    .then(response => response.json())
    .then(data => {
      console.log("TEMPO: ", JSON.stringify(data))
      moveDownAnimation();
      isDown = true;
    })
    .catch(error => console.log(error));
}


const clearResult = () => {
  if (isDown) {
    $('.result').empty();
    moveUpAnimation();
  }
}
const moveUpAnimation = () => {
  console.log("estou a tentar ir para cima")
  const box = document.getElementById("box")
  box.style.animation = "moveUp 2s forwards";

  //box.style.animationPlayState = "paused";
  //example 5s linear 2s infinite alternate
}
/* Deal with a request for suggested cocktails */
async function dealWithSuggestedCocktails() {
  let fetchedArray = await fetchCocktails();

  const utterance = new SpeechSynthesisUtterance("Eis as minhas sugestões de cócketeiles meu brou");
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
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
  let chosen10Cocktails = choose10Cocktails(json);

  return chosen10Cocktails;
}

/*function to select 10 random cocktails*/
function choose10Cocktails(fetchedArray) {
  let totalCocktailsToPresent = 10;
  let chosen10Cocktails = [];
  let randomIndex;

  for (let i = 0; i < totalCocktailsToPresent; i++) {
    //falta verificação para evitar que possam ser indexes iguais
    randomIndex = Math.floor(Math.random() * 100);
    chosen10Cocktails.push(fetchedArray.drinks[randomIndex]);
  }
  console.log('chosen 10', chosen10Cocktails);

  return chosen10Cocktails;
}

/*function to present 10 random suggested cocktails*/
function presentCocktails(fetchedArray) {
  let cocktailName;
  let cocktailImage;

  for (let i = 0; i < fetchedArray.length; i++) {
    cocktailImage = fetchedArray[i].strDrinkThumb;
    cocktailName = fetchedArray[i].strDrink;
    //$('div.result').append(`<h2 style = "color:white">${cocktailName} </h2>`);
    $('div.result').append(`<div class="cocktailImage"><img id="cocktail" src="${cocktailImage}" 
    onclick = "fetchCocktailById(${fetchedArray[i].idDrink})" style = "cursor:pointer"></div>`);
  }
}

//function to fetch details after a click event on an individual cocktail image
function fetchCocktailById(id) {

}


function readResponseAsBlob(response) {
  return response.blob();
}


async function presentMovies(fetchedArray, trailer) {
  console.log("present this", fetchedArray)
  console.log("now present this", trailer)
  const IMGPATH = "https://image.tmdb.org/t/p/w1280";
  const main = document.getElementById("main");
  data.results.forEach(element => {
    // Creating elemnts for our data inside the main tag. 
    const el = document.createElement('div');
    const image = document.createElement('img');
    const text = document.createElement('h2');

    text.innerHTML = `${element.title}`;
    image.src = IMGPATH + element.poster_path;
    el.appendChild(image);
    el.appendChild(text);
    main.appendChild(el);
  });

}


// API information.
const IMGPATH = "https://image.tmdb.org/t/p/w1280";

const main = document.getElementById("main");

/* call the showMovies function that requests the movie data from the Api using fetch.
 Then it puts those data in the main HTML tag by creating elments for those data. */

function showMovies(url) {
  fetch(url).then(res => res.json())
    .then(function (data) {
      data.results.forEach(element => {
        // Creating elemnts for our data inside the main tag. 
        const el = document.createElement('div');
        const image = document.createElement('img');
        const text = document.createElement('h2');

        text.innerHTML = `${element.title}`;
        image.src = IMGPATH + element.poster_path;
        el.appendChild(image);
        el.appendChild(text);
        main.appendChild(el);
      });
    });
}








//jQuery reminder
/*$('div.result').
 $('.result').html('<h1>rfyghnjmk>/h1>');
 $('.result').append('<div></div>');
 $('.result').after('<div></div>');

//para fazer quando alguém carregar no botão uma seguinte vez
/*$('.result').empty();*/
