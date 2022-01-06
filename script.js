//TMDB

const API_KEY = "api_key=1cf50e6248dc270629e802686245c2c8";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?popular?&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

const newLocal = 18;
var alldata = [];
var genres = [
  //   {
  //     id: 28,
  //     name: "Action",
  //   },
  //   {
  //     id: 12,
  //     name: "Adventure",
  //   },
  //   {
  //     id: 16,
  //     name: "Animation",
  //   },
  //   {
  //     id: 35,
  //     name: "Comedy",
  //   },
  //   {
  //     id: 80,
  //     name: "Crime",
  //   },
  //   {
  //     id: 99,
  //     name: "Documentary",
  //   },
  //   {
  //     id: newLocal,
  //     name: "Drama",
  //   },
  //   {
  //     id: 10751,
  //     name: "Family",
  //   },
  //   {
  //     id: 14,
  //     name: "Fantasy",
  //   },
  //   {
  //     id: 36,
  //     name: "History",
  //   },
  //   {
  //     id: 27,
  //     name: "Horror",
  //   },
  //   {
  //     id: 10402,
  //     name: "Music",
  //   },
  //   {
  //     id: 9648,
  //     name: "Mystery",
  //   },
  //   {
  //     id: 10749,
  //     name: "Romance",
  //   },
  //   {
  //     id: 878,
  //     name: "Science Fiction",
  //   },
  //   {
  //     id: 10770,
  //     name: "TV Movie",
  //   },
  //   {
  //     id: 53,
  //     name: "Thriller",
  //   },
  //   {
  //     id: 10752,
  //     name: "War",
  //   },
  //   {
  //     id: 37,
  //     name: "Western",
  //   },
];

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = "";
var totalPages = 100;

var selectedGenre = [];
setGenre();
function setGenre() {
  tagsEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
      highlightSelection();
    });
    tagsEl.append(t);
  });
}

function highlightSelection() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("highlight");
  });
  clearBtn();
  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const hightlightedTag = document.getElementById(id);
      hightlightedTag.classList.add("highlight");
    });
  }
}

function clearBtn() {
  let clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.classList.add("highlight");
  } else {
    let clear = document.createElement("div");
    clear.classList.add("tag", "highlight");
    clear.id = "clear";
    clear.innerText = "Clear x";
    clear.addEventListener("click", () => {
      selectedGenre = [];
      setGenre();
      getMovies(API_URL);
    });
    tagsEl.append(clear);
  }
}

getMovies(API_URL);

function getMovies(url) {
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      if (data.results.length !== 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;

        if (currentPage <= 1) {
          prev.classList.add("disabled");
          next.classList.remove("disabled");
        } else if (currentPage >= totalPages) {
          prev.classList.remove("disabled");
          next.classList.add("disabled");
        } else {
          prev.classList.remove("disabled");
          next.classList.remove("disabled");
        }

        tagsEl.scrollIntoView({ behavior: "smooth" });
      } else {
        main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
      }
    });
}

function showMovies(data) {
  main.innerHTML = "";
  alldata = data;
  data.forEach((movie) => {
    console.log(movie);
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.setAttribute("id", "box-" + id);
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
             <img src="${
               poster_path
                 ? IMG_URL + poster_path
                 : "http://via.placeholder.com/1080x1580"
             }" alt="${title}" style = "height : 20rem;">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">

                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">View Trailer</button
            </div>
        
        `;

    main.appendChild(movieEl);

    document.getElementById(id).addEventListener("click", () => {
      console.log(id);
      openNav(movie);
    });
    document.getElementById("box-" + id).addEventListener("click", () => {
      console.log(id);
      // openNav(movie);
      renderData(id);
    });
  });
}

function renderData(id) {
  console.log(alldata);
  var data = alldata.filter((d) => d.id == id)[0];
  console.log(data);
  let timeFormat = `${(data["runtime"] / 60) ^ 0}:` + (data["runtime"] % 60);
  let gener = data["genres"];
  // let data1 = gener.map((i) => {
  //   return i["name"];
  // });
  document.getElementById("bigPic").innerHTML = `
  <section class = "data"> 
  <div class = "poster">
  <img src="${IMG_URL}/${data["poster_path"]}" alt = "movie-image" style = "margin : 1rem 1 rem; padding : 1rem 1rem;" />
  </div>
  <div class = "movie-detail">
  <p><h1 align="left">${data["original_title"]}</h1></p>
  <p align="left"><span>Release Date : </span>${data["release_date"]}</p>
  <!--<p align="left"><span>Genre : </span></p>-->
  <p align="left"><span>Run Time : </span>${data["runtime"]} </p>
  <p align="left"><span>Movie Language : </span>${data["original_language"]}</p>
  <p align="left"><span>Rating : </span>${data["vote_average"]}</p>
  <p align="left"><span>Movie OverView : </span>${data["overview"]}</p>
  </div>
  </section>
  `;
}

const showBTN = document.querySelector(".showBTN");
const hideSec = document.querySelector(".hideSec");

function showSection(id) {
  if (hideSec.classList.contains("reveal")) {
    hideSec.classList.remove("reveal");
  } else {
    hideSec.classList.add("reveal");
  }
}

showBTN.addEventListener("click", showSection, false);
/* Selecting DOM elements */
const revealButton = document.querySelector(".reveal-button");
const hiddenSection = document.querySelector(".hidden-section");

/* Callback function */
function revealSection() {
  if (hiddenSection.classList.contains("reveal")) {
    hiddenSection.classList.remove("reveal");
  } else {
    hiddenSection.classList.add("reveal");
  }
}

/* Event listener */
revealButton.addEventListener("click", revealSection, false);

const pagiShow = document.querySelector(".pagiShow");
const pagiHide = document.querySelector(".pagiHide");

function pagiSection() {
  if (pagiHide.classList.contains("reveal")) {
    pagiHide.classList.remove("reveal");
  } else {
    pagiHide.classList.add("reveal");
  }
}

pagiShow.addEventListener("click", pagiSection, false);

const pagiSee = document.querySelector(".pagiSee");
const pagiBlock = document.querySelector(".pagiBlock");

function newPagiSection() {
  if (pagiBlock.classList.contains("reveal")) {
    pagiBlock.classList.remove("reveal");
  } else {
    pagiBlock.classList.add("reveal");
  }
}

pagiSee.addEventListener("click", newPagiSection, false);

const pagiAll = document.querySelector(".pagiAll");
const pagiNone = document.querySelector(".pagiNone");

function newPagiAllSection() {
  if (pagiNone.classList.contains("reveal")) {
    pagiNone.classList.remove("reveal");
  } else {
    pagiNone.classList.add("reveal");
  }
}

pagiAll.addEventListener("click", newPagiAllSection, false);

function bigImage(data) {
  // let timeformat = `${(data["runtime"] / 60) ^ 0}:` + (data["runtime"] % 60);
  // let genre = data["genres"];
  // let data1 = genre.map((i) => {
  //   return i["name"];
  // });
  // document.getElementById("bigPic").innerHTML = "";
  // html = `<div class="one-data-movie">
  // <img src="https://www.moviedb.org/t/pw220_and_h330_faces${data["poster_path"]}" alt = "movie-image"/>
  // <div class="more-data">
  // <h1>${data["original_title"]}</h1>
  // <p class="more-p"><span>Release Date : </span>${data["release_data"]}</p>
  // <div class="again-data">
  // <p class="more-p"><span>Genre : </span>${data1}</p>
  // <p class="more-p"><span>Run Time : </span>${timeformat}</p>
  // <p class="more-p again-more-p"><span>Movie Language : </span>${data["original_language"]}</p>
  // <p class="more-p"><span>Rating : </span>${data["vote_average"]}</p>
  // </div>
  // </div>
  // </div>
  // <div class="overview">
  // <p class="overview"-P><span>Movie OverView : </span>${data["overview"]}
  // </p>
  // </div>`;
  // document.getElementById("bigPic").insertAdjacentHTML("beforeend", html);
  // }
}

const overlayContent = document.getElementById("overlay-content");
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + "/movie/" + id + "/videos?" + API_KEY)
    .then((res) => res.json())
    .then((videoData) => {
      console.log(videoData);
      if (videoData) {
        document.getElementById("myNav").style.width = "100%";
        if (videoData.results.length > 0) {
          var embed = [];
          var dots = [];
          videoData.results.forEach((video, idx) => {
            let { name, key, site } = video;

            if (site == "YouTube") {
              embed.push(`
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          
          `);

              dots.push(`
              <span class="dot">${idx + 1}</span>
            `);
            }
          });

          var content = `
        <h1 class="no-results">${movie.original_title}</h1>
        <br/>
        
        ${embed.join("")}
        <br/>

        <div class="dots">${dots.join("")}</div>
        
        `;
          overlayContent.innerHTML = content;
          activeSlide = 0;
          showVideos();
        } else {
          overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
        }
      }
    });
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0;
var totalVideos = 0;

function showVideos() {
  let embedClasses = document.querySelectorAll(".embed");
  let dots = document.querySelectorAll(".dot");

  totalVideos = embedClasses.length;
  embedClasses.forEach((embedTag, idx) => {
    if (activeSlide == idx) {
      embedTag.classList.add("show");
      embedTag.classList.remove("hide");
    } else {
      embedTag.classList.add("hide");
      embedTag.classList.remove("show");
    }
  });

  dots.forEach((dot, indx) => {
    if (activeSlide == indx) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

leftArrow.addEventListener("click", () => {
  if (activeSlide > 0) {
    activeSlide--;
  } else {
    activeSlide = totalVideos - 1;
  }

  showVideos();
});

rightArrow.addEventListener("click", () => {
  if (activeSlide < totalVideos - 1) {
    activeSlide++;
  } else {
    activeSlide = 0;
  }
  showVideos();
});

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  selectedGenre = [];
  setGenre();
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

function pageCall(page) {
  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplit[0] + "?" + b;
    getMovies(url);
  }
}
