window.onload = () => {
  const talkBtn = document.getElementById("talk");
  const content = document.querySelector(".content");

  talkBtn.addEventListener("click", () => {
    recognition.start();
  });
}

const tmdbApiKey = "9c1056f24930eda7a00e44206ef692d9";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
  console.log("voice activated, you can speak");
}

recognition.onresult = (event) => {
  const result = event.results[0][0].transcript;
  console.log("TU DISSESTE: ", result);

  if (result.includes("filme") || result.includes("movie")) {
    console.log('TENHO FILME');
    const resultArr = result.split("filme");
    const movie = resultArr[1];
    console.log("MOVIE: ", movie);
    fetch("https://api.themoviedb.org/3/search/movie?api_key=" + tmdbApiKey + "&language=en-US&query=" + movie + "&page=1&include_adult=false")
      .then(response => response.json())
      .then(data => console.log("DATA: ", data))
      .catch(error => console.log(error))
  }
}
