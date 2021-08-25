const commandsView = () => {
  console.log('COMANDOS');

  $('div.commandsPage').append(`
    <div class="commandsPageContainer">
      <div class="commandsImgContainer">
        <img class="commandsImg" src="./felizberta.png" />
      </div>
      <div class="textContainer">
        <h1 class="homePageTitle">Felizberta</h1>
        <h2 class="homePageSubtitle">A nova App de voz!</h2>
        <br>
        <p class="appDesc">Bacon ipsum dolor amet doner pig jerky cow brisket, boudin pastrami drumstick ham
         hock pancetta tenderloin. Pork chop t-bone pig meatball kevin porchetta rump boudin buffalo. Spare ribs
         ribeye andouille tenderloin leberkas, meatloaf ball tip beef ribs doner flank. 
         Filet mignon brisket pastrami ribeye meatloaf chuck 
         beef short loin. Porchetta shankle sirloin, 
         landjaeger jowl biltong shoulder. Shankle ribeye 
         meatloaf doner brisket. Spare ribs frankfurter beef 
         ribs buffalo, corned beef meatball ground round 
         sirloin picanha.</p>
      </div>
    </div>`
  );
}

export default commandsView;