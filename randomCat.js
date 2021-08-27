/* Get a random Cat */

const dealWithRandomCat = (strings, fadeInContent, moveDownAnimation, speak) => {
  fetch("https://api.thecatapi.com/v1/images/search")
    .then(response => response.json())
    .then(data => {
      fadeInContent();
      moveDownAnimation();
      console.log("Cat Data: ", data);
      speak(strings.random_cat);

      $('div.result').append('<div class="randomCat"></div>');

      $('div.randomCat').append(`
        <div class="catImgContainer">
          <img class="catImg" src="${data[0].url}"/>
        </div>`
      );
    })
    .catch(error => {
      console.log(error);
      speak(strings.api_error)
    });
}

export default dealWithRandomCat;