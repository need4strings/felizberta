import Strings from "./strings.js";

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
         <i id="icon" class="fas fa-video fa-5x"></i>
         <i id="icon" class="fas fa-cocktail fa-5x"></i>
         <i id="icon" class="fas fa-cloud-sun fa-5x"></i>
         <i id="icon" class="fab fa-google fa-5x"></i>
         <i id="icon" class="fab fa-youtube fa-5x"></i>
         <i id="icon" class="fas fa-plus fa-5x"></i>
      </div>
    </div>`
  );

  $('.fas').click(iconClick);
  $('.fab').click(iconClick);
}

const iconClick = (event) => {
  const className = event.target.className;
  let utterance;

  if (className.includes('video')) {
    utterance = new SpeechSynthesisUtterance(Strings.explain_movies);
  } else if(className.includes('cocktail')) {
    utterance = new SpeechSynthesisUtterance(Strings.explain_cocktails);
  } else if(className.includes('cloud-sun')) {
    utterance = new SpeechSynthesisUtterance(Strings.explain_weather);
  } else if (className.includes('google')) {
    utterance = new SpeechSynthesisUtterance(Strings.explain_google);
  } else if (className.includes('youtube')) {
    utterance = new SpeechSynthesisUtterance(Strings.explain_youtube);
  } else if(className.includes('plus')) {
    utterance = new SpeechSynthesisUtterance(Strings.explain_more);
  }
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

export default landingPageView;