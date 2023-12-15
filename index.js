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
      <div id="target" class="dropdown-content"></div>
    </div>
  </div>
`;

const dropdown = document.querySelector(".dropdown");

const onInput = async event => {
    const movies = await fetchData(event.target.value)
    dropdown.classList.add("is-active");
    for (const movie of movies) {
        const option = document.createElement("a");
        option.classList.add("dropdown-item");
        option.innerHTML = `
            <img src="${movie.Poster}"/>
            <h2>${movie.Title}</h2>
        `
        document.getElementById("target").appendChild(option);
    }
};

const input = document.getElementById("search-bar");
input.addEventListener("input", debounce(onInput, 500));