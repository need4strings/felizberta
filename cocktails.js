/* Deal with a request for suggested cocktails */
async function dealWithSuggestedCocktails(isDown, strings, fadeInContent, moveDownAnimation, speak) {
  let fetchedArray = await fetchCocktails(isDown, speak, strings);

  speak(strings.cocktails + strings.bro);

  setTimeout(() => { 
    speak(strings.alcohol);
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
async function fetchCocktails(isDown, speak, strings) {
  let myRequest = new Request('https:thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail');
  let response = await fetch(myRequest);

  if (!response.ok) {
    speak(strings.api_error);
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

export default dealWithSuggestedCocktails;