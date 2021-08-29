/* Deal with movies */
const dealWithMovie = async (resultArr, ApiKeys, strings, speak, moveDownAnimation, fadeInContent, clearResult) => {
  const IMGPATH = "https://image.tmdb.org/t/p/w1280";
  const tmdbApiKey = ApiKeys.tmdbApiKey;
  const movie = resultArr[1];
  fadeInContent();
  moveDownAnimation();
  const presentMovies = await movieRequest(tmdbApiKey, movie, speak, IMGPATH, clearResult, strings);
}

const movieRequest = async (tmdbApiKey, movie, speak, IMGPATH, clearResult, strings) => {
  fetch("https://api.themoviedb.org/3/search/movie?api_key=" + tmdbApiKey + "&language=en-US&query=" + movie + "&page=1&include_adult=false")
    .then(response => response.json())
    .then(async data => {
      speak(strings.foundMovie + movie + strings.bro);

      //criar movie container
      $('div.result').append(`<div id="movieContainer" class="movieContainer"></div>`);

      data.results.slice(0, 5).forEach(movie => {
        const { title, poster_path, vote_average, id } = movie;

        $('.movieContainer').append(`
          <div class="movieList">
            <img src="${IMGPATH + poster_path}"/>
            <div class="movieList-info">
              <h3>${title}</h3>
              <br/>
              <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="knowMore">
              <br/> 
              <a id=${id} class="know-more" href="#" style="text-decoration: none;">Movie Details </a> 
            </div>
          </div>`
        )

        const seeMore = document.getElementsByClassName("know-more");

        for (let index = 0; index < seeMore.length; index++) {
          const element = seeMore[index];
          element.addEventListener("click", () => {
            movieSelected(event, tmdbApiKey, IMGPATH, clearResult);
          });
        }

      });
    })
    .catch(error => console.log(error))
}

function getColor(vote) {
  if (vote >= 8) {
    return 'green'
  } else if (vote >= 5) {
    return "orange"
  } else {
    return 'red'
  }
}
const movieSelected = async (event, tmdbApiKey, IMGPATH, clearResult) => {
  const id = event.target.id;
  const trailer = await dealWithMovieTrailer(id, tmdbApiKey);
  const cast = await dealWithMovieCast(id, tmdbApiKey);
  const director = await dealWithMovieDirector(id, tmdbApiKey);
  const genre = await dealWithMovieGenre(id, tmdbApiKey);

  $('.movieContainer').empty();
  const result = document.getElementById("result");
  fetch("https://api.themoviedb.org/3/movie/" + id + "?api_key=" + tmdbApiKey)
    .then(response => response.json())
    .then(async movie => {
      const { title, poster_path, vote_average, id, release_date, overview } = movie;
      const card = document.createElement('div');

      card.innerHTML = `   
           <div class="card">
            <div class="poster">
               <img src="${IMGPATH + poster_path}">
            </div>
            <div class="movieDetails">
            <h2>${title}<br><br><span>Release Date: ${release_date}</span><br></h2>
                <div class="director">
                <span>Directed by: ${director}</span>
                </div>
                <div class="rating">
                <span> Score: ${vote_average}</span>
                </div>
                  <div class="tags">
                      <span class="genre">${genre}</span>
                  </div>    
                  <div class="info">
                    <p> ${overview} </p>
                  </div>
                  <a href="https://www.youtube.com/embed/${trailer}" class ="trailer" target="_blank">Watch Trailer</a>
                  <div class="star">
                      <h4>Cast</h4>
                      <ul>
                          <li><img src="${IMGPATH + cast[0]}"></li>
                          <li><img src="${IMGPATH + cast[1]}"></li>
                          <li><img src="${IMGPATH + cast[2]}"></li>
                          <li><img src="${IMGPATH + cast[3]}"></li>
                          <li><img src="${IMGPATH + cast[4]}"></li>
                          <li><img src="${IMGPATH + cast[5]}"></li>
                      </ul> 
                  </div>   
             </div>
            </div>  
        `
      result.appendChild(card);
      moveDownAnimation();

    })

    .catch((err) => {
      console.log(err);
    });
}

/* Deal with movie trailer */
const dealWithMovieTrailer = async (movieId, tmdbApiKey) => {

  return fetch("https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=" + tmdbApiKey + "&language=en-US")
    .then(response => response.json())
    .then(data => {
      const trailer = data.results[0].key;
      return trailer;
      // we have to put this ^ in our iframe when presenting the results;
    })
    .catch(error => {
      console.log(error);
      speak(strings.api_error)
    });
}

const dealWithMovieCast = async (id, tmdbApiKey) => {

  return fetch("https://api.themoviedb.org/3/movie/" + id + "/credits?api_key=" + tmdbApiKey)
    .then(response => response.json())
    .then(data => {
      const cast = data.cast.map(({profile_path}) => profile_path)
      return cast;
    })
    .catch(error => {
      console.log(error);
    });
}

const dealWithMovieDirector = async (id, tmdbApiKey) => {

  return fetch("https://api.themoviedb.org/3/movie/" + id + "/credits?api_key=" + tmdbApiKey)
    .then(response => response.json())
    .then(data => {
      const whoDirected = data.crew.find(director => director.job === "Director")
      return whoDirected.name
    })
    .catch(error => {
      console.log(error);
    });
}

const dealWithMovieGenre = async (id, tmdbApiKey) => {

  return fetch("https://api.themoviedb.org/3/movie/" + id + "?api_key=" + tmdbApiKey + "&language=en-US")
    .then(response => response.json())
    .then(data => {
      const whichGenre = data.genres.map(({name}) => name)
      return whichGenre
    })
    .catch(error => {
      console.log(error);
    });

}

export default dealWithMovie;