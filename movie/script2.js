const APIKEY = "abfbad389bf01bb271980502ad35707a";
const imgpath = "https://image.tmdb.org/t/p/";
const getjson = async function (url) {
  const res = await fetch(url);
  console.log(res);
  if (!res.ok) return "a";
  const data = res.json();
  return data;
};
const getMovie=async function(URL){
    const data = await getjson(URL);
    console.log(data);
    setBg(data.backdrop_path)
    setintro(data);
    displayGenre(data.genres)
}
document.querySelector("#recommended").addEventListener("mouseover", (e) => {
  if (!e.target.closest(".movie")) {
    return;
  }
  e.target
    .closest(".movie")
    .querySelector(".overview")
    .classList.remove("hidden");
});
document.querySelector("#recommended").addEventListener("mouseout", (e) => {
  if (!e.target.closest(".movie")) {
    return;
  }
  e.target.closest(".movie").querySelector(".overview").classList.add("hidden");
});
const recommendMovies = async function (data) {
  data.forEach((el) => {
    document.querySelector("#recommended .row").insertAdjacentHTML(
      "beforeend",
      `
    <div class="col-md-2 col-9 col-sm-4 m-4">
                    <div class=" card movie" data-id=${el.id}>
                        <div class="image"><img src="${imgpath}w500${el.poster_path}" alt="">
                        </div>
                        <div class="hidden overview">${el.overview}</div>
                        <div class="vote">${el.vote_average}</div>
                        <div class="cardfoot">
                            <h6>${el.original_title}</h6>
                            <p></p>
                        </div>
                    </div>
                </div>  
    `
    );
  });
};
const displayGenre=async function(data){
    console.log(data);
    data.forEach(element => {
        document.querySelector(".genre").insertAdjacentHTML(
          "afterbegin",
          `
        <div class="genre-item me-2">${element.name}</div>
        `
        );
    });
}
const setintro =async function(data){
    document.querySelector("#info h2").innerText=`${data.original_title}`;
    document.querySelector("#info img").src=`${imgpath}original${data.poster_path}`
    document.querySelector("#info p").innerText = `${data.overview}`;
    document.querySelector("#info a").href=`${data.homepage}`;
}
const setBg=async function(url){
     document.querySelector(
       ".nav img"
     ).src = `${imgpath}original${url}`;
     document.querySelector(
       ".nav"
     ).style.backgroundImage = `url(${imgpath}original${url})`;
}
document.querySelector(".home-btn").addEventListener("click",el=>{
    window.location="../index.html"
})
window.onload=async function () {
  const id = sessionStorage.getItem("id");
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".wrapper-main").classList.add("hidden")
  await getMovie(
    `https://api.themoviedb.org/3/movie/%20${id}?api_key=abfbad389bf01bb271980502ad35707a&language=en-US`
  );
  const data = await getjson(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=abfbad389bf01bb271980502ad35707a&language=en-US&page=1`
  );
  recommendMovies(data.results);
  setTimeout(async () => {
  document.querySelector(".wrapper-main").classList.remove("hidden");
  document.querySelector(".loader").classList.add("hidden");
  }, 3000);
}
document.querySelector("#recommended").addEventListener("click", (e) => {
  // document.querySelector("#info").dataset.id=el.dataset.id;
  console.log(e);
  if (e.target.closest(".movie")) {
    sessionStorage.setItem("id", e.target.closest(".movie").dataset.id);
    location.reload();
  }
});