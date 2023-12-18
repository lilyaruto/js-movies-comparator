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
        });
        document.getElementById("target").appendChild(option);
    }
};

document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove("is-active");
    }
});

input.addEventListener("input", debounce(onInput, 500));