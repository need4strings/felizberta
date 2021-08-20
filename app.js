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
  //começar animação
  
  const outline = document.getElementById("delayed");
  outline.style.animation = "pulse 3s ease-out infinite";
  console.log("voice activated, you can speak");
}

recognition.onresult = (event) => {
  //parar animação
  const outline = document.getElementById("delayed");
  outline.style.animation = "";
  console.log('EVENNT: ', event);
  console.log('USER LANGUAGE: ', userLanguage);
  const result = event.results[0][0].transcript;
  console.log("TU DISSESTE: ", result);
  let resultArr;

  if (userLanguage === "pt-PT") {
    resultArr = result.split("filme");
  } else {
    resultArr = result.split("movie");
  }

  if (result.includes("filme") || result.includes("movie")) {
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
      })
      .catch(error => console.log(error))
  }
}
