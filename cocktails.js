/* Deal with a request for suggested cocktails */
async function dealWithSuggestedCocktails(isDown, strings, fadeInContent, moveDownAnimation, speak) {
  let fetchedArray = await fetchCocktails(isDown);

  speak(strings.cocktails_suggestion + strings.bro);

  setTimeout(() => { 
    speak(strings.alcohol);
  }, 1000);

  fadeInContent();
  moveDownAnimation();

  const presented = await presentCocktails(fetchedArray);
  console.log("PRESENTED", presented);
}

/*fetch function for suggested cocktails */
async function fetchCocktails(isDown) {
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
  let totalReceivedCocktails = fetchedArray.drinks;
  let totalCocktailsToPresent = 6;
  let chosen6Cocktails = [];
  let randomIndex;

  for (let i = 0; i < totalCocktailsToPresent; i++) {
    randomIndex = Math.floor(Math.random() * 100);

    while (chosen6Cocktails.includes(totalReceivedCocktails[randomIndex])){
      randomIndex = Math.floor(Math.random() * 100);
    }
    chosen6Cocktails.push(totalReceivedCocktails[randomIndex]);
  }
  return chosen6Cocktails;
}

/*function to present 6 random suggested cocktails*/
function presentCocktails(fetchedArray) {
  let cocktailName;
  let cocktailImage;
  $('div.result').append(`<div class="cocktails"></div>`);

  fetchedArray.forEach(element => {
    cocktailImage = element.strDrinkThumb;
    cocktailName = element.strDrink;

    $('.cocktails').append(`
    <div class="cocktailsBox">
      <div id="cocktailsImgBox" class="cocktailsImgBox">
        <img id="cocktail" src="${cocktailImage}">
      </div>
      <div id ="cocktailsDetails" class="cocktailsDetails">
        <div id ="cocktailsContent" class ="cocktailsContent">
          <h2>${cocktailName}</h2>
          <a id="${element.idDrink}" class="seeMore" style="cursor:pointer">See more</a>
        </div>
      </div>
    </div>`);
  })

  const seeMore = document.getElementsByClassName("seeMore");

  for (let index = 0; index < seeMore.length; index++) {
    const element = seeMore[index];
    element.addEventListener("click", fetchCocktailById)
  }
}

//function to fetch details after a click event on an individual cocktail image
function fetchCocktailById(event) {

  const id = event.target.id;
  
  fetch('https:thecocktaildb.com/api/json/v1/1/lookup.php?i=' + id)
    .then(response => response.json())
    .then(data => {
      const drink = data.drinks[0];
      const instructions = drink.strInstructions;
      let totalIngredients = [];
      let counter = 1;
      let hasIngredients = true;

      while (hasIngredients) {
        let ingredientProperty = `strIngredient${counter}`;

        if (drink[ingredientProperty] !== null && drink[ingredientProperty] !== "") {
          let measuresProperty = `strMeasure${counter}`;
          const ingredient = drink[ingredientProperty];
          const measure = drink[measuresProperty];

          totalIngredients.push(ingredient + " - " + measure);
          counter++;
          continue;
        }
        hasIngredients = false;
      }

      $('.result').after(`
        <div class="bg-modal">
            <div class="modal-content">
                <div class="close">+</div>
                <div class="modal-details">
                  <h2 id="ingredientsTitle">Ingredients</h2>
                  <ul></ul>
                  <h2 id="instructionsTitle">Instructions</h2>
                  <p id="instructions">${instructions}</p>
                </div>
            </div>
        </div>`
      )


      for (let ingredient in totalIngredients) {
      $(`.modal-content ul`).append(`<li>${totalIngredients[ingredient]}</li>`);
      }
      
      $('.bg-modal').css('display', 'flex');

      $('.close').click(closeModal);
      $('')

    })
    .catch(error => console.log(error));
}

function closeModal() {
  $('.bg-modal').css('display', 'none');
  $('.bg-modal').remove();
}

export default {dealWithSuggestedCocktails};