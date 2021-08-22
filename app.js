window.onload = () => {
  const talkBtn = document.getElementById("talk");
  const content = document.querySelector(".content");

  talkBtn.addEventListener("click", () => {
    recognition.start();
  });
}

const userLanguage = window.navigator.userLanguage || window.navigator.language;
const tmdbApiKey = "9c1056f24930eda7a00e44206ef692d9";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
  clearResult();
  startAnimation();
  console.log("voice activated, you can speak");
}

/* Deal with voice command */
recognition.onresult = (event) => {
  stopAnimation();

  console.log('EVENNT: ', event);
  console.log('USER LANGUAGE: ', userLanguage);
  const result = event.results[0][0].transcript;
  console.log("TU DISSESTE: ", result);

  if (result.includes("filme") || result.includes("movie")) {
    let resultArr;

    if (userLanguage === "pt-PT") {
      resultArr = result.split("filme");
    } else {
      resultArr = result.split("movie");
    }
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
  const box = document.getElementById("box")
  box.style.animation = "moveDown 2s forwards";
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
      moveDownAnimation();
    })
    .catch(error => console.log(error))
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

function clearResult(){
  $('.result').empty();
}


//jQuery reminder
/*$('div.result').
 $('.result').html('<h1>rfyghnjmk>/h1>');
 $('.result').append('<div></div>');
 $('.result').after('<div></div>');

//para fazer quando alguém carregar no botão uma seguinte vez
/*$('.result').empty();*/