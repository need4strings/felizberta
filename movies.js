/* Deal with movies */
const dealWithMovie = (resultArr, apiKeys, strings, moveDownAnimation, isDown, speak) => {
  console.log('TENHO FILME');
  const movie = resultArr[1];
  console.log("MOVIE: ", movie);
  const tmdbApiKey = apiKeys.tmdbApiKey;

  fetch("https://api.themoviedb.org/3/search/movie?api_key=" + tmdbApiKey + "&language=en-US&query=" + movie + "&page=1&include_adult=false")
    .then(response => response.json())
    .then(data => {
      speak(strings.foundMovie + movie + strings.bro)
      console.log("DATA: ", data)
      dealWithMovieTrailer(data.results[0].id, tmdbApiKey);
      moveDownAnimation();
      isDown = true;
    })
    .catch(error => {
      console.log(error);
      speak(strings.api_error)
    });
}

/* Deal with movie trailer */
const dealWithMovieTrailer = (movieId, tmdbApiKey) => {
  fetch("https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=" + tmdbApiKey + "&language=en-US")
    .then(response => response.json())
    .then(data => {
      console.log("TRAILER: ", data);
      const trailer = data.results[0].key;
      // we have to put this ^ in our iframe when presenting the results;
    })
    .catch(error => {
      console.log(error);
      speak(strings.api_error)
    });
}

export default dealWithMovie;