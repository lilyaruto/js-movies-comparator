const createAutoComplete = ({root, renderOption, onSelect, inputValue, fetchData}) => {
    root.innerHTML = `
        <label>Find your film</label>
        <input type="text" class="search-bar">
        <div class="dropdown">
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div id="target" class="dropdown-content results"></div>
            </div>
        </div>
        <div id="summary"></div>
    `;

    const dropdown = root.querySelector(".dropdown");
    const results = root.querySelector(".results");
    const input = root.querySelector(".search-bar");

    const onInput = async event => {
        const items = await fetchData(event.target.value);

        if (!items.length) {
            dropdown.classList.remove("is-active");
            return;
        }

        results.innerHTML = "";
        dropdown.classList.add("is-active");
        for (const item of items) {
            const option = document.createElement("a");
            option.classList.add("dropdown-item");
            option.innerHTML = renderOption(item);
            option.addEventListener("click", event => {
                dropdown.classList.remove("is-active");
                input.value = inputValue(item);
                onSelect(item);
            });
            results.appendChild(option);
        }
    };

    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove("is-active");
        }
    });

    input.addEventListener("input", debounce(onInput, 500));
};