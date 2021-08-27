/* Deal with movies */
const dealWithMovie = (resultArr, ApiKeys, strings, moveDownAnimation, isDown, speak, clearResult) => {
  const IMGPATH = "https://image.tmdb.org/t/p/w1280";
  const tmdbApiKey = ApiKeys.tmdbApiKey;
  const movie = resultArr[1];
  const result = document.getElementById("result");

  fetch("https://api.themoviedb.org/3/search/movie?api_key=" + tmdbApiKey + "&language=en-US&query=" + movie + "&page=1&include_adult=false")
    .then(response => response.json())
    .then(async data => {
      speak("Encontrei isto para o filme " + movie + " meu brou");

      const trailer = await dealWithMovieTrailer(data.results[0].id, tmdbApiKey);

      //criar movie container
      $('div.result').append(`<div class="movieContainer"></div>`);

      data.results.slice(0, 5).forEach(movie => {
        const {title, poster_path, vote_average, id} = movie; 

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
              <a id=${id} class="know-more" href="#">Movie Details</a> 
            </div>
          </div>`
        )

        const seeMore = document.getElementsByClassName("know-more");

        for (let index = 0; index < seeMore.length; index++) {
          const element = seeMore[index];
          element.addEventListener("click", movieSelected)
        }
        
      });
      moveDownAnimation();
        isDown = true;
    })
    .catch(error => console.log(error))
}

function getColor(vote) {
  if(vote>= 8){
      return 'green'
  }else if(vote >= 5){
      return "orange"
  }else{
      return 'red'
  }
}
const movieSelected = async (event) => {
  console.log("EVENT::::::: ", event)
  clearResult();
  const result = document.getElementById("result");
  return fetch("https://api.themoviedb.org/3/movie/" + id + "?api_key=" + ApiKeys.tmdbApiKey)
    .then(response => response.json())
    .then(async movie => {
      const {title, poster_path, vote_average, id, release_date, genre, overview} = movie; 
        console.log(movie + "isto é o filme")
        const card = document.createElement('div');
        
        card.innerHTML = `   
           <div class="card">
            <div class="poster">
               <img src="${IMGPATH + poster_path}">
            </div>
            <div class="movieDetails">
            <h2>${title}<br> Release Date: ${release_date}<br><span>Directed by:</span></h2>
                <div class="rating">
                <span> Score: ${vote_average}</span>
                </div>
                  <div class="tags">
                      <span class="genre">Fantasia</span>
                  </div>    
                  <div class="info">
                    <p> ${overview} </p>
                  </div> 
                  <div class="star">
                      <h4>cast</h4>
                      <ul>
                          <li><imagem></li>
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