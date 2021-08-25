const commandsView = (strings, fadeInContent, moveDownAnimation) => {
  console.log('COMANDOS');
  fadeInContent();
  moveDownAnimation();
  const utterance = new SpeechSynthesisUtterance(strings.commands);
  utterance.rate = 1;
  speechSynthesis.speak(utterance);

  $('div.commandsPage').append(`
    <div class="commandsPageContainer">
      <div class="commandsTextContainer">
        <h2 class="homePageSubtitle">Comandos disponíveis</h2>
        <br>
        <ul class="commandsList">
          <li class="commandsListItem"><b>${strings.movies}: </b>${strings.commands_list_movie}</li>
          <li class="commandsListItem"><b>${strings.cocktails}: </b>${strings.commands_list_cocktails}</li>
          <li class="commandsListItem"><b>${strings.weather}: </b>${strings.commands_list_weather}</li>
          <li class="commandsListItem"><b>${strings.google}: </b>${strings.commands_list_google}</li>
          <li class="commandsListItem"><b>${strings.youtube}: </b>${strings.commands_list_youtube}</li>
        </ul>
      </div>
      <div class="commandsImgContainer">
        <img class="commandsImg" src="./micros.png" />
      </div>
    </div>`
  );
}

export default commandsView;