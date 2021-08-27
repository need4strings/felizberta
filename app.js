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

    dealWithMovie(resultArr);
  } else if (result.includes("Google")) {
    resultArr = result.split("Google");
    dealWithSearch(resultArr);
  } else if (result.includes("YouTube")) {
    resultArr = result.split("YouTube");
    dealWithYoutube(resultArr);
  } else if (result.includes("tempo em")) {
    resultArr = result.split("tempo em");
    dealWithWeather(resultArr);
    dealWithMovie(resultArr);
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
      const utterance = new SpeechSynthesisUtterance("Encontrei isto para o filme " + movie + " meu brou");
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

  const utterance = new SpeechSynthesisUtterance("Eis as minhas sugestões de cócketeiles meu brou");
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
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
  $('div.result').append(`<div class="cocktails"></div>`);
  
  for (let i = 0; i < fetchedArray.length; i++) {
    cocktailImage = fetchedArray[i].strDrinkThumb;
    cocktailName = fetchedArray[i].strDrink;

    $('.cocktails').append(`
    <div class="cocktailsBox">
      <div id="cocktailsImgBox" class="cocktailsImgBox">
        <img id="cocktail" src="${cocktailImage}">
      </div>
      <div id ="cocktailsDetails" class="cocktailsDetails">
        <div id ="cocktailsContent" class ="cocktailsContent">
          <h2>${cocktailName}</h2>
          <a id="${i}" onclick="fetchCocktailById(${fetchedArray[i].idDrink},${i})" style="cursor:pointer">See more</a>
        </div>
      </div>
    </div>`);
  }
}

//function to fetch details after a click event on an individual cocktail image
function fetchCocktailById(id, clickedId) {
  
  fetch('https:thecocktaildb.com/api/json/v1/1/lookup.php?i=' + id)
    .then(response => response.json())
    .then(data => {
      console.log("DATA: ", data);
      const drink = data.drinks[0];
      const instructions = drink.strInstructions;
      let totalIngredients = [];
      let counter = 1;
      let hasIngredients = true;

      while (hasIngredients) {
        let ingredientProperty = `strIngredient${counter}`;

        if (drink[ingredientProperty] !== null && drink[ingredientProperty] !== "") {
          //ingredientProperty = `strIngredient${counter}`;
          let measuresProperty = `strMeasure${counter}`;

          const ingredient = drink[ingredientProperty];
          const measure = drink[measuresProperty];

          totalIngredients.push(ingredient + " - " + measure);
          counter++;
          continue;
        }
        hasIngredients = false;
      }

      console.log('total ingredients = ', totalIngredients);

      $('.result').after(`
      <div class="bg-modal">
          <div class="modal-content">
              <div onclick="closeModal()" class="close">+</div>
              <p id="title">Ingredients</p>
              <ul></ul>
              <p id="title">Instructions</p>
              <p id="instructions">${instructions}</p>
          </div>
      
      </div>`)
      
      for (let ingredient in totalIngredients) {
      $(`.modal-content ul`).append(`<li>${totalIngredients[ingredient]}</li>`);
      }
      
      $('.bg-modal').css('display', 'flex');

  
    })
    .catch(error => console.log(error));
}

function closeModal() {
  $('.bg-modal').css('display', 'none');
  $('.bg-modal').remove();
}


//jQuery reminder
/*$('div.result').
 $('.result').html('<h1>rfyghnjmk>/h1>');
 $('.result').append('<div></div>');
 $('.result').after('<div></div>');

//para fazer quando alguém carregar no botão uma seguinte vez
/*$('.result').empty();*/
