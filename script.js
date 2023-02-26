const APIKEY = 'abfbad389bf01bb271980502ad35707a';
const imgpath='https://image.tmdb.org/t/p/'
let curURL=`https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=`
const getjson=async function(url){
    const res = await fetch(url);
    if(!res.ok) return "a"
    const data= res.json();
    return data
}
const displayPoster=async function(url){
  const data = await getjson(url);
  console.log(data);
  // document.querySelector(".poster h2").innerText = data.results[0].original_title;
  // document.querySelector("#poster-info").innerText=data.results[0].overview;
  if (data == "a") {
    document.querySelector(".main").classList.add("hidden")
    document.querySelector("#headline").innerHTML = "SOMETHING WENT WRONG";
    return;
  }
  if (data.total_pages == 1) {
    
    document.querySelector(".pagination ").classList.add("hidden");
    document.querySelector(".pagination ").classList.remove("d-flex");
  } else {
    document.querySelector(".pagination ").classList.remove("hidden");
    document.querySelector(".pagination ").classList.add("d-flex");
  }
  document.querySelector(".trending").innerHTML = "";
  displayMovies(data.results);
  document.querySelector(".main").classList.remove("hidden");
  document.querySelector(".pagination").dataset.max=data.total_pages;
}
const displayMovies=async function(data){
  data.forEach((el) => {
    document.querySelector(".trending").insertAdjacentHTML(
      "beforeend",
      `
    <div class="col-md-2 col-sm-4 col-9 m-sm-4 m-1">
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
}

// hover
document.querySelector(".main").addEventListener("mouseover",e=>{
    if(!e.target.closest(".movie")){
      return
    }
     e.target
       .closest(".movie")
       .querySelector(".image")
       .style.filter="blur(0.5)"
    e.target.closest(".movie").querySelector(".overview").classList.remove("hidden");
  })
document.querySelector(".main").addEventListener("mouseout",e=>{
    if (!e.target.closest(".movie")) {
      return
    }
    e.target
      .closest(".movie")
      .querySelector(".overview")
      .classList.add("hidden");
  });
  // pagination
document.querySelector(".pagination").addEventListener("click",async function(e) {
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".wrapper-main").classList.add("hidden");
  const i=document.querySelector(".pagination").dataset.page;
  const max = document.querySelector(".pagination").dataset.max;
  if (document.querySelector(".trending").innerHTML === ""){
    document.querySelector(".pagination").classList.add("hidden")
    return;
  }
  document.querySelector(".pagination").classList.remove("hidden");
  
  if (e.target.closest(".back")) {
      document.querySelector(".trending").innerHTML = "";
      displayPoster(`${curURL}${+i - 1}`);
      document.querySelector(".pagination").dataset.page = +i - 1;
      if (i == 2) document.querySelector(".back").classList.add("hidden");
      if (i <= +max)
        document.querySelector(".next").classList.remove("hidden");
      console.log(i);
    }
  if (e.target.closest(".next")) {
      document.querySelector(".trending").innerHTML="";
      displayPoster(`${curURL}${+i + 1}`);
      document.querySelector(".pagination").dataset.page=+i+1;
      if (i == 1) document.querySelector(".back").classList.remove("hidden");
      if (i >= +max - 1) {
        console.log("a");
        document.querySelector(".next").classList.add("hidden");
      }
    }
  setTimeout(async () => {
    document.querySelector(".wrapper-main").classList.remove("hidden");
    document.querySelector(".loader").classList.add("hidden");
  }, 2000); 
})
//search
document.querySelector(".search").addEventListener("click",async function(e){
  try{
  let query=document.querySelector("#search-movie").value;
  document.querySelector("#headline").innerHTML="search results";
  displayPoster(
    `https://api.themoviedb.org/3/search/movie?api_key=abfbad389bf01bb271980502ad35707a&language=en-US&query=${query}&page=1`
  );
  curURL=`https://api.themoviedb.org/3/search/movie?api_key=abfbad389bf01bb271980502ad35707a&language=en-US&query=${query}&page=`
  document.querySelector(".pagination").dataset.page="1";
  }catch(err){
    console.log(err);
  }
})
// dynamic poster
window.onload=async function(){
  document.querySelector(".loader").classList.remove("hidden");
  document.querySelector(".wrapper-main").classList.add("hidden");
  displayPoster(
    `https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=1`
  );
  const data = await getjson(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}&language=en-US`
  );

  document.querySelector(
    ".nav"
  ).style.backgroundImage = `url(${imgpath}original${data.results[0].backdrop_path})`;
  document.querySelector(".nav .moviedata h2").innerText =
    data.results[0].original_title;
  document.querySelector(".nav .moviedata p").innerText =
    data.results[0].overview;
  document.querySelector(
    ".nav img"
  ).src = `${imgpath}original${data.results[0].backdrop_path}`;
  setInterval(changebg,8000);
    
  function changebg() {
       let i = Math.floor(Math.random() * 19);
       document.querySelector( ".nav" ).style.backgroundImage = `url(${imgpath}original${data.results[i].backdrop_path})`;
       document.querySelector(".nav .moviedata h2").innerText =  data.results[i].original_title;
       document.querySelector(".nav .moviedata p").innerText = data.results[i].overview;
       document.querySelector(".nav img").src =
         `${imgpath}original${data.results[i].backdrop_path}`;
     }
  setTimeout(async () => {
    document.querySelector(".wrapper-main").classList.remove("hidden");
    document.querySelector(".loader").classList.add("hidden");
  }, 2000);     
}
document.querySelector(".main").addEventListener("click", (e) => {
  // document.querySelector("#info").dataset.id=el.dataset.id;
  console.log(e);
  if ((e.target.closest(".movie"))) {
    sessionStorage.setItem("id", e.target.closest(".movie").dataset.id);
    window.location = "./movie/movie.html";
  }
});