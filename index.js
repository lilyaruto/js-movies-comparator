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
        onMovieSelection(movie, document.querySelector("#summary-left"));
    }
});

createAutoComplete({
    ...autoCompleteParams,
    root: document.querySelector(".search-right"),
    onSelect(movie) {
        document.querySelector(".hint-field").classList.add("is-hidden");
        onMovieSelection(movie, document.querySelector("#summary-right"));
    }
});

const onMovieSelection = async(movie, summaryElement) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "80f0e4df",
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieDescTemplate(response.data);
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