const fetchData = async(searchInput) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "80f0e4df",
            s: searchInput
        }
    });
    console.log(response.data)
}

const debounce = (func, delay = 1000) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};


const onInput = debounce(event => {
    fetchData(event.target.value)
}, 500);

const input = document.getElementById("search-bar");
input.addEventListener("input", onInput);