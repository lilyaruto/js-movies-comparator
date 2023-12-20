const autoCompleteParams = {
    renderOption(movie) {
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        return `
            <img src="${imgSrc}"/>
            <h2>${movie.Title}</h2>
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchInput) {
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
};

createAutoComplete({
    ...autoCompleteParams,
    root: document.querySelector(".search-left"),
    onSelect(movie) {
        document.querySelector(".hint-field").classList.add("is-hidden");
        onMovieSelection(movie, document.querySelector("#summary-left"), "left");
    }
});

createAutoComplete({
    ...autoCompleteParams,
    root: document.querySelector(".search-right"),
    onSelect(movie) {
        document.querySelector(".hint-field").classList.add("is-hidden");
        onMovieSelection(movie, document.querySelector("#summary-right"), "right");
    }
});

let leftMovie;
let rightMovie;

const onMovieSelection = async(movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "80f0e4df",
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieDescTemplate(response.data);

    if (side === "left") {
        leftMovie = summaryElement;
    } else {
        rightMovie = summaryElement;
    }

    if (leftMovie && rightMovie) {
        compare(leftMovie, rightMovie);
    }
};

const compare = (left, right) => {
    const paramsL = left.querySelectorAll(".movie-desc-add")
    const paramsR = right.querySelectorAll(".movie-desc-add")
    paramsL.forEach((element, index) => {
        if (parseFloat(element.dataset.value) > parseFloat(paramsR[index].dataset.value)) {
            element.classList.remove("loss");
            element.classList.add("win");
            paramsR[index].classList.remove("win");
            paramsR[index].classList.add("loss");
        } else if (parseFloat(element.dataset.value) < parseFloat(paramsR[index].dataset.value)) {
            element.classList.remove("win");
            element.classList.add("loss");
            paramsR[index].classList.remove("loss");
            paramsR[index].classList.add("win");
        }
    });
}

const movieDescTemplate = (movieInfo) => {
    console.log(movieInfo)
    let box_office;
    if (!movieInfo.BoxOffice) {
        box_office = 0;
    } else {
        box_office = movieInfo.BoxOffice === "N/A" ? 0 : parseInt(movieInfo.BoxOffice.replace("$", "").replaceAll(",", ""));
    }
    const rate = movieInfo.imdbRating === "N/A" ? 0 : parseFloat(movieInfo.imdbRating);
    const metascore = movieInfo.Metascore === "N/A" ? 0 : parseInt(movieInfo.Metascore);

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
                <div data-value=${box_office} class="movie-desc-add">
                    <h4>${movieInfo.BoxOffice}</h4>
                    <span>Box office</span>
                </div>
                <div class="movie-desc-add">
                    <h4>${movieInfo.Awards}</h4>
                    <span>Awards</span>
                </div>
                <div data-value=${rate} class="movie-desc-add">
                    <h4>${movieInfo.imdbRating}</h4>
                    <span>IMDB Rating</span>
                </div>
                <div data-value=${metascore} class="movie-desc-add">
                    <h4>${movieInfo.Metascore}</h4>
                    <span>Metascore</span>
                </div>
            </div>
        </article>
    `;
};