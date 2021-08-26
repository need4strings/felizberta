/* Get a random Meme */

const dealWithRandomMeme = (strings, fadeInContent, moveDownAnimation, speak) => {
  fetch("https://meme-api.herokuapp.com/gimme/1")
    .then(response => response.json())
    .then(data => {
      fadeInContent();
      moveDownAnimation();
      console.log("MEME Data: ", data);

      $('div.result').append(`
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