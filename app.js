window.onload = () => {
  const talkBtn = document.getElementById("talk");
  const content = document.querySelector(".content");

  talkBtn.addEventListener("click", () => {
    recognition.start();
  });
}

const userLanguage = window.navigator.userLanguage || window.navigator.language;
const tmdbApiKey = "9c1056f24930eda7a00e44206ef692d9";
const googleSearchApiKey = "AIzaSyB4goZy0s0ULExCk1IKGt3EZtuVlwZL4nw";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
  startAnimation();
  console.log("voice activated, you can speak");
}

/* Deal with voice command */
recognition.onresult = (event) => {
  stopAnimation();
  console.log('EVENNT: ', event);
  console.log('USER LANGUAGE: ', userLanguage);
  const result = event.results[0][0].transcript;
  console.log("TU DISSESTE: ", result);
  let resultArr;

  if (result.includes("filme") || result.includes("movie")) {

    if (userLanguage === "pt-PT") {
      resultArr = result.split("filme");
    } else {
      resultArr = result.split("movie");
    }

    dealWithMovie(resultArr);
  } else if (result.includes("pesquisa")) {
    resultArr = result.split("Google");
    dealWithSearch(resultArr);
  }
}

/* Start Animation */
const startAnimation = () => {
  const outline = document.getElementById("delayed");
  outline.style.animation = "pulse 3s ease-out infinite";
}

/* Stop animation */
const stopAnimation = () => {
  const outline = document.getElementById("delayed");
  outline.style.animation = "";
}

/* Deal with movies */
const dealWithMovie = (resultArr) => {
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

/* Deal with Google search */
const dealWithSearch = (resultArr) => {
  console.log('TENHO PESQUISA');
  const searchFor = resultArr[1];
  console.log('VOU PROCURAR POR: ', searchFor);

  window.open("https://www.google.com/search?q=" + searchFor, '_blank');
}
