const fetchData = async(searchInput) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "80f0e4df",
            s: searchInput
        }
    });

    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
}

const root = document.querySelector(".root");
root.innerHTML = `
    <label>Find your film</label>
    <input type="text" name="" id="search-bar">
    <div class="dropdown">
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div id="target" class="dropdown-content results"></div>
        </div>
    </div>
    <div id="summary"></div>
`;

const dropdown = document.querySelector(".dropdown");
const results = document.querySelector(".results");
const input = document.getElementById("search-bar");

const onInput = async event => {
    const movies = await fetchData(event.target.value);

    if (!movies.length) {
        dropdown.classList.remove("is-active");
        return;
    }

    results.innerHTML = "";
    dropdown.classList.add("is-active");
    for (const movie of movies) {
        const option = document.createElement("a");
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        option.classList.add("dropdown-item");
        option.innerHTML = `
            <img src="${imgSrc}"/>
            <h2>${movie.Title}</h2>
        `
        option.addEventListener("click", event => {
            dropdown.classList.remove("is-active");
            input.value = movie.Title;
            onMovieSelection(movie);
        });
        document.getElementById("target").appendChild(option);
    }
};

document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove("is-active");
    }
});

const onMovieSelection = async(movie) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "80f0e4df",
            i: movie.imdbID
        }
    });
    console.log(response.data);
    document.querySelector("#summary").innerHTML = movieDescTemplate(response.data);
};

const movieDescTemplate = (movieInfo) => {
    return `
        <article class="movie-desc">
            <div class="movie-desc-upper">
                <img class="movie-desc-poster" src=${movieInfo.Poster}>
                <div>
                    <h2 class="movie-desc-title">${movieInfo.Title} (${movieInfo.Year})</h2>
                    <h4>${movieInfo.Genre}</h4>
                    <p>${movieInfo.Plot}</p>
                </div>
            </div>
            <div>
                <div class="movie-desc-add">
                    <h4>${movieInfo.BoxOffice}</h4>
                    <span>Box office</span>
                </div>
                <div class="movie-desc-add">
                    <h4>${movieInfo.Awards}</h4>
                    <span>Awards</span>
                </div>
                <div class="movie-desc-add">
                    <h4>${movieInfo.imdbRating}</h4>
                    <span>IMDB Rating</span>
                </div>
                <div class="movie-desc-add">
                    <h4>${movieInfo.Metascore}</h4>
                    <span>Metascore</span>
                </div>
            </div>
        </article>
    `;
};

input.addEventListener("input", debounce(onInput, 500));