/* Get a random Meme */
const dealWithRandomMeme = (strings, fadeInContent, moveDownAnimation, speak) => {

  speak(strings.joke);

  fetch("https://meme-api.herokuapp.com/gimme/1")
    .then(response => response.json())
    .then(data => {
      fadeInContent();
      moveDownAnimation();

      $('div.result').append('<div class="randomMeme"></div>');

      $('div.randomMeme').append(`
        <div class="memeImgContainer">
          <img class="memeImg" src="${data.memes[0].url}"/>
        </div>`
      );
    })
    .catch(error => {
      console.log(error);
      speak(strings.api_error)
    });
}

export default dealWithRandomMeme;