const APIkey = "KvIjm5FP077DsfgGq2kLnXDTViwRJP7f";

// Fetch new items on page load for trending and suggestions section
window.onload = () => {
	fetchSuggestionGifs(4);
	fetchTrendingGifs(16);
	document.querySelector("#search-bar").focus();
};
// Dropdown list visibility toggle
document.querySelector("#dropdown-btn").onclick = function(e) {
	e.preventDefault();
	const $dropdownList = document.querySelector("#dropdown-list");
	$dropdownList.classList.toggle("hidden");
};
// Closes dropdown on click outside or "Escape" keypress
window.onclick = e => {
	const $dropdownList = document.querySelector("#dropdown-list");
	const $searchSuggestions = document.querySelector("#search-suggestions");
	hideElements($searchSuggestions);
	!e.target.closest("#dropdown-btn") ? hideElements($dropdownList) : null;
};
document.onkeydown = e => {
	if (e.key === "Escape") {
		const $dropdownList = document.querySelector("#dropdown-list");
		const $searchSuggestions = document.querySelector("#search-suggestions");
		hideElements($dropdownList, $searchSuggestions);
	}
};
// Handles search bar functionality
document.querySelector("#search-bar").oninput = function(e) {
	const $searchButton = document.querySelector("#search-button");
	if (e.target.value !== "") {
		$searchButton.disabled = false;
		if (handleSearchSuggestionSearch(8, document.querySelector("#search-bar").value)) {
			// showElements(document.querySelector("#search-suggestions"));
		}
	} else {
		$searchButton.disabled = true;
		hideElements(document.querySelector("#search-suggestions"));
	}
};
// Gets search results from form submission
document.searchform.onsubmit = e => {
	e.preventDefault();
	handleSearchFunctionality(document.querySelector("#search-bar").value);
};

async function handleSearchFunctionality(searchValue) {
	replaceSearchText(searchValue);
	document.querySelector("#search-bar").value = "";
	document.querySelector("#search-bar").focus();
	document.querySelector("#search-button").disabled = true;
	document.querySelector("#search-result-container").innerHTML = "";
	await fetchSearchResultGifs(16, searchValue);
	hideElements(
		document.querySelector("#trends"),
		document.querySelector("#suggestions"),
		document.querySelector("#search-suggestions")
	);
	document.querySelector("#search-suggestions").innerHTML = "";
	await showElements(document.querySelector("#search-results"));
}
async function handleSearchSuggestionSearch(limit, keywords) {
	processedKeywords = processSearchValues(keywords);
	const $searchSuggestions = document.querySelector("#search-suggestions");
	const url = `http://api.giphy.com/v1/gifs/search?q=${processedKeywords}&api_key=${APIkey}&limit=${limit}`;
	searchResults = await fetchURL(url);
	$searchSuggestions.innerHTML = "";
	showElements(document.querySelector("#search-suggestions"));
	searchResults.data.length
		? searchResults.data.forEach(searchTitle => {
				searchTitle.title ? $searchSuggestions.append(newElement("searchTitle", searchTitle)) : null;
		  })
		: hideElements(document.querySelector("#search-suggestions"));

	document.querySelectorAll(".btn-search-suggestion").forEach(element => {
		element.onclick = () => {
			handleSearchFunctionality(element.innerText);
		};
	});
}
async function fetchTrendingGifs(limit) {
	const $trendingGifs = document.querySelector("#trend-grid");
	const gifOffset = Math.floor(Math.random() * 50);

	gifsTrending = await fetchURL(
		`http://api.giphy.com/v1/gifs/trending?api_key=${APIkey}&limit=${limit}&offset=${gifOffset}`
	);
	gifsTrending.data.forEach(gif => {
		let aspectRatio = "";
		gif.images["480w_still"].width / gif.images["480w_still"].height >= 1.5 ? (aspectRatio = "item-double") : null;
		$trendingGifs.append(newElement("trend", gif, aspectRatio));
	});
}
async function fetchSuggestionGifs(limit) {
	const $suggestedGifs = document.querySelector("#suggested-container");
	const suggestionArray = [
		"baby+yoda",
		"adventure+time",
		"oh+shit",
		"rick+morty",
		"the+office",
		"sillicon+valley",
		"the+mandalorian",
		"pulp+fiction",
		"fight+club",
		"it",
		"godzilla",
		"wtf"
	];
	const suggestion = Math.floor(Math.random() * (suggestionArray.length - 1));

	gifsSuggestions = await fetchURL(
		`http://api.giphy.com/v1/gifs/search?q=${suggestionArray[suggestion]}&api_key=${APIkey}&limit=${limit}`
	);

	gifsSuggestions.data.forEach(gif => {
		$suggestedGifs.append(newElement("window", gif));
	});
}
async function fetchSearchResultGifs(limit, keywords) {
	const $searchResultsContainer = document.querySelector("#search-result-container");
	processedKeywords = processSearchValues(keywords);
	searchResults = await fetchURL(
		`http://api.giphy.com/v1/gifs/search?q=${processedKeywords}&api_key=${APIkey}&limit=${limit}`
	);
	await searchResults.data.forEach(gif => {
		let aspectRatio = "";
		gif.images["480w_still"].width / gif.images["480w_still"].height >= 1.5 ? (aspectRatio = "item-double") : null;
		$searchResultsContainer.append(newElement("trend", gif, aspectRatio));
	});
}

// Generic fetch function
function fetchURL(url) {
	const fetchData = fetch(url)
		.then(response => {
			return response.json();
		})
		.catch(error => {
			return error;
		});
	return fetchData;
}
function newElement(type, element, ratio = "") {
	element.title === "" ? (element.title = "&emsp;") : null;
	const $container = document.createElement("div");
	switch (type) {
		case "window":
			$container.innerHTML = `<div class="window-item ${ratio}">
			<div class="wi-header">
					${element.title}
				<button class="remove-element"></button>
			</div>
			<div class="img-container">
				<img class="img-element" src="${element.images.original.url}" />
				<a href="${element.bitly_url}" target="_blank" type="button" class="btn-primary tag"><span>Ver más...</span></a>
			</div>
		</div>`;
			return $container.firstChild;

		case "trend":
			const titleToArray = element.title.split(" ");
			let titleArrayToTags = "";
			titleToArray.forEach(word => {
				titleArrayToTags += `#${word} `;
			});
			$container.innerHTML = `<div class="trend-item ${ratio}">
				<a href="${element.bitly_url}" target="_blank">
					<img src="${element.images.original.url}" alt="${element.title}" class="img-element" />
					<div class="trend-header">
						${titleArrayToTags}
					</div>
				</a>
			</div>
		</div>`;
			return $container.firstChild;

		case "searchTitle":
			$container.innerHTML = `<button class="search-element btn-search-suggestion">
		<span>${element.title}</span>
		</button>`;
			return $container.firstChild;
	}
}
function hideElements(...elements) {
	elements.forEach(element => {
		element.classList.add("hidden");
	});
}
function showElements(...elements) {
	elements.forEach(element => {
		element.classList.remove("hidden");
	});
}
function processSearchValues(inputValues) {
	return (outputValues = inputValues.split(" ").join("+"));
}
function replaceSearchText(newText) {
	document.querySelector("#search-results-input").setAttribute("placeholder", `Resultados de búsqueda: ${newText}`);
}
