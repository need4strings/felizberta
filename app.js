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
  //box.style.animationPlayState = "paused";
  //example 5s linear 2s infinite alternate
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
  console.log('fetched array ',fetchedArray);

  const utterance = new SpeechSynthesisUtterance("Encontrei isto sobre cócktails meu brou");
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
  moveDownAnimation();

 const presented = await presentCocktails(fetchedArray);



}

/*fetch function for suggested cocktaisl */
async function fetchCocktails() {
  let myRequest = new Request('https:thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail');
  let response = await fetch(myRequest);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  let json = await response.json();
  return json;
}

/*function to present 10 random suggested cocktails*/
async function presentCocktails(fetchedArray) {
  let cocktailName;
  let cocktailImage;
  let totalCocktailsToPresent = 10;
  let chosen10Cocktails = [];
  let randomIndex;

  for (let i = 0; i < totalCocktailsToPresent; i++) {
    //falta verificação para evitar que possam ser indexes iguais
    randomIndex = Math.floor(Math.random() * 100);
    chosen10Cocktails.push(fetchedArray.drinks[randomIndex]);
  }
  console.log('chosen 10', chosen10Cocktails);

  //let chosen10Cocktails = await choose10Cocktais(fetchedArray); 

  /*$('div.result').
  $('.result').html('<h1>rfyghnjmk>/h1>');
  $('.result').append('<div></div>');
  $('.result').after('<div></div>');*/
  for (let i = 0; i < chosen10Cocktails.length; i++) {
    cocktailImage = chosen10Cocktails[i].strDrinkThumb;
    cocktailName = chosen10Cocktails[i].strDrink;
    $('div.result').append(`<h2 style = "color:white">${cocktailName} </h2>`);
    $('div.result').append(`<img id="cocktail" src="${cocktailImage}" 
    onclick = "fetchCocktailById(${chosen10Cocktails[i].idDrink})" style = "cursor:pointer">`);
  }
  
  //para fazer quando alguém carregar no botão uma seguinte vez
  /*$('.result').empty();

  //depois das fotos estarem clicaveis
  $('div.cocktails').click(function(e){
    //assim fico a saber o id da photo clicada
    let id = e.currentTarget.id;
    fetchCockttailById(id);
  });

  function fetchCockttailById(id){
    
  }*/
}

/*function to select 10 random cocktails*/
async function choose10Cocktais(fetchedArray){
  let totalCocktailsToPresent = 10;
  let chosen10Cocktails = [];
  let randomIndex;

  for (let i = 0; i < totalCocktailsToPresent; i++) {
    //falta verificação para evitar que possam ser indexes iguais
    randomIndex = Math.floor(Math.random() * 100);
    chosen10Cocktails.push(fetchedArray.drinks[randomIndex]);
  }
  console.log('chosen 10', chosen10Cocktails);
  return choose10Cocktais;
}

