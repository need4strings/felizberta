const landingPageView = () => {

  $('div.homePage').append(`
    <div class="homePageContainer">
      <div class="imgContainer">
        <img class="homePageImg" src="./felizberta.png" />
      </div>
      <div class="textContainer">
        <h1 class="homePageTitle">Felizberta, a nova App de voz!</h1>
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
         <i class="fas fa-video fa-5x" onclick="${$("#button").bind("click", iconClick)}"></i>
         <i class="fas fa-cocktail fa-5x"></i>
         <i class="fas fa-cloud-sun fa-5x"></i>
         <i class="fab fa-google fa-5x"></i>
         <i class="fab fa-youtube fa-5x"></i>
         <i class="fas fa-plus fa-5x"></i>
      </div>
    </div>`
  );
}

const iconClick = function(e){
  console.log("Click");
}

export default landingPageView;