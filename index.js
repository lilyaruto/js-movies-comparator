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

const onInput = async event => {
    const movies = await fetchData(event.target.value)
    for (const movie of movies) {
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${movie.Poster}"/>
            <h2>${movie.Title}</h2>
        `
        document.getElementById("target").appendChild(div);
    }
};

const input = document.getElementById("search-bar");
input.addEventListener("input", debounce(onInput, 500));