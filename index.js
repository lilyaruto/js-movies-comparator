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
    <div class="dropdown is-active">
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div id="target" class="dropdown-content"></div>
    </div>
  </div>
`;

const onInput = async event => {
    const movies = await fetchData(event.target.value)
    for (const movie of movies) {
        const div = document.createElement("div");
        div.innerHTML = `
            <a href="#" class="dropdown-item">
                <img src="${movie.Poster}"/>
                <h2>${movie.Title}</h2>
            </a>
        `
        document.getElementById("target").appendChild(div);
    }
};

const input = document.getElementById("search-bar");
input.addEventListener("input", debounce(onInput, 500));