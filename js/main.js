const APIkey = "KvIjm5FP077DsfgGq2kLnXDTViwRJP7f";

// Fetch new items on page load for trending and suggestions section
window.onload = () => {
	fetchSuggestions(4);
	fetchTrending(20);
	document.querySelector("#search-bar").focus();
};

// Dropdown list visibility toggle
document.querySelector("#dropdown-btn").onclick = function(e) {
	const $dropdownList = document.querySelector("#dropdown-list");
	e.preventDefault();
	$dropdownList.classList.toggle("hidden");
};

// Closes dropdown on click outside
document.onclick = function(e) {
	const $dropdownList = document.querySelector("#dropdown-list");
	if (e.target === document.querySelector("body")) {
		hideElements($dropdownList);
	}
};

// Handles search bar functionality
document.querySelector("#search-bar").oninput = function(e) {
	const $searchButton = document.querySelector("#search-button");
	if (e.target.value !== "") {
		$searchButton.disabled = false;
		fetchSearchTitles(7, document.querySelector("#search-bar").value);
		showElements(document.querySelector("#search-suggestions"));
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

	document.querySelector("#search-button").disabled = true;

	await fetchSearchResults(20, searchValue);
	/* 
		ocultar elementos sugerencias y trends
		limpiar gifs anteriores en contenedor
		mostrar contenedor de resultados	
		reemplazar texto input
		limpiar valor del input
		bloquear botón de búsqueda (si no se hace automáticamente)
		hacer fetch
			await generar elementos
	*/
}

function replaceSearchText(newText) {
	document.querySelector("#search-results-input").setAttribute("placeholder", `Resultados de búsqueda: ${newText}`);
	document.querySelector("#search-bar").value = "";
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

async function fetchTrending(limit) {
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

async function fetchSuggestions(limit) {
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

async function fetchSearchTitles(limit, keywords) {
	const $searchSuggestions = document.querySelector("#search-suggestions");
	processedKeywords = keywords.split(" ").join("+");

	searchResults = await fetchURL(
		`http://api.giphy.com/v1/gifs/search?q=${processedKeywords}&api_key=${APIkey}&limit=${limit}`
	);
	$searchSuggestions.innerHTML = "";

	if (searchResults.data.length > 0) {
		showElements(document.querySelector("#search-suggestions"));
		searchResults.data.forEach(searchTitle => {
			searchTitle.title ? $searchSuggestions.append(newElement("searchTitle", searchTitle)) : null;
		});
	}

	const $searchSuggestionsBtn = document.querySelectorAll(".btn-search-suggestion");
	$searchSuggestionsBtn.forEach(element => {
		element.onclick = e => {
			replaceSearchText(element.innerText);
			fetchSearchResults(20, element.innerText);
			document.querySelector("#search-button").disabled = true;
		};
	});
}

async function fetchSearchResults(limit, keywords) {
	const $searchResults = document.querySelector("#search-results");
	const $searchResultsContainer = document.querySelector("#search-result-container");
	processedKeywords = keywords.split(" ").join("+");

	searchResults = await fetchURL(
		`http://api.giphy.com/v1/gifs/search?q=${processedKeywords}&api_key=${APIkey}&limit=${limit}`
	);

	$searchResultsContainer.innerHTML = "";
	showElements($searchResults);
	hideElements(
		document.querySelector("#trends"),
		document.querySelector("#suggestions"),
		document.querySelector("#search-suggestions")
	);
	searchResults.data.forEach(gif => {
		let aspectRatio = "";
		gif.images["480w_still"].width / gif.images["480w_still"].height >= 1.5 ? (aspectRatio = "item-double") : null;
		$searchResultsContainer.append(newElement("trend", gif, aspectRatio));
	});
}

function newElement(type, element, ratio = "") {
	element.title === "" ? (element.title = "&emsp;") : null;
	const $container = document.createElement("div");
	let $element = "";
	switch (type) {
		case "window":
			$element = `<div class="window-item ${ratio}">
				<div class="wi-header">
						${element.title}
					<button class="remove-element"></button>
				</div>
				<div class="img-container">
					<img class="img-element" src="${element.images.original.url}" />
					<a href="${element.bitly_url}" target="_blank" type="button" class="btn-primary tag"><span>Ver más...</span></a>
				</div>
			</div>`;
			$container.innerHTML = $element;
			return $container.firstChild;
		case "trend":
			const titleToArray = element.title.split(" ");
			let titleArrayToTags = "";
			titleToArray.forEach(word => {
				titleArrayToTags += `#${word} `;
			});
			$element = `<div class="trend-item ${ratio}">
				<a href="${element.bitly_url}" target="_blank">
					<img src="${element.images.original.url}" alt="${element.title}" class="img-element" />
					<div class="trend-header">
						${titleArrayToTags}
					</div>
				</a>
			</div>
		</div>`;
			$container.innerHTML = $element;
			return $container.firstChild;
		case "searchTitle":
			$element = `<button class="search-element btn-search-suggestion">
		<span>${element.title}</span>
		</button>`;
			$container.innerHTML = $element;
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
