const fetchData = async() => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "80f0e4df",
            s: "avengers"
        }
    });

    console.log(response.data)
}

fetchData();