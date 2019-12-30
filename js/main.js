// Selectors
/* document.querySelector("#search-bar")
document.querySelector("#search-button")
document.querySelector("#search-suggestions")
document.querySelector("#search-result-container")
document.querySelector("#search-results")
document.querySelector("#suggestions")
document.querySelector("#suggested-container")
document.querySelectorAll(".btn-search-suggestion")
document.querySelector("#dropdown-list")
document.querySelector("#trends")
document.querySelector("#trend-grid")
 */

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
// Show my-gifs section
document.querySelector("#btn-my-gifs").onclick = e => {
	showMyGifsSection();
};
// Create gif trigger
document.querySelector("#btn-create-gif").onclick = e => {
	createGifSection();
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
		document.querySelector("#my-gifs"),
		document.querySelector("#create-gif"),
		document.querySelector("#search-suggestions")
	);
	document.querySelector("#search-suggestions").innerHTML = "";
	await showElements(document.querySelector("#search-results"), document.querySelector("#search-tags"));
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
				searchTitle.title && searchTitle.title !== " "
					? $searchSuggestions.append(newElement("searchTitle", searchTitle))
					: null;
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
		"rick+and+morty",
		"the+office",
		"sillicon+valley",
		"the+mandalorian",
		"pulp+fiction",
		"fight+club",
		"it",
		"godzilla",
		"wtf",
		"trippy"
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

	const $tagCotnainer = document.querySelector("#search-tags");
	$tagCotnainer.innerHTML = "";
	searchResults.data.map(element => {
		element.title && element.title !== " " && element.title !== "&emsp;"
			? $tagCotnainer.appendChild(newElement("tag", element))
			: null;
	});

	document.querySelectorAll(".tag").forEach(tag => {
		tag.onclick = () => {
			handleSearchFunctionality(tag.innerText);
		};
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
			<img class="img-element loading-animation" src="${element.images.original.url}" alt="${element.title}" /> 	
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
					<img src="${element.images.original.url}" alt="${element.title}" class="img-element loading-animation" />
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
		case "tag":
			$container.innerHTML = `<button type="button" class="btn-primary tag"><span>${element.title}</span></button>`;
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
function showMyGifsSection() {
	hideElements(
		document.querySelector("#suggestions"),
		document.querySelector("#search-results"),
		document.querySelector("#search-box"),
		document.querySelector("#trends"),
		document.querySelector("#my-gifs"),
		document.querySelector("#create-gif")
	);
	showElements(document.querySelector("#my-gifs"));
}
function createGifSection() {
	hideElements(
		document.querySelector("#suggestions"),
		document.querySelector("#search-results"),
		document.querySelector("#search-box"),
		document.querySelector("#trends"),
		document.querySelector("#my-gifs"),
		document.querySelector("#create-gif"),
		document.querySelector(".nav-item-container")
	);
	showElements(document.querySelector("#create-gif"), document.querySelector("#my-gifs"));
}
// localStorage.setItem("color-theme", "light");

const myGifsSection = (function() {
	let myGifs = [];

	//cache DOM
	const $gifsGrid = document.querySelector("#my-gifs-grid");

	//bind events
	document.querySelector("#create-gif-continue").onclick = e => {
		stage2();
	};

	_render();
	function _render() {
		fetchGifsFromStorage();
		$gifsGrid.innerHTML = "";
		myGifs.forEach(element => {
			let aspectRatio = "";
			element.images["480w_still"].width / element.images["480w_still"].height >= 1.5
				? (aspectRatio = "item-double")
				: null;
			newElement("window", element, aspectRatio);
		});
	}
	function fetchGifsFromStorage() {
		Object.keys(localStorage).forEach(element => {
			element.substring(0, 3) === "gif" ? myGifs.push(element) : null;
		});
	}
	function stage2() {
		document.querySelector("#create-gif").firstElementChild.classList.remove("window-size-md");
		document.querySelector("#create-gif").firstElementChild.classList.add("window-size-lg");
		hideElements(document.querySelector("#stage1"));
		showElements(document.querySelector("#stage2"));
		document.querySelector("#create-gif-section-header").innerText = "Un Chequeo Antes de Empezar";
		videoRecordInit();
	}
	async function videoRecordInit() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					height: { max: 480 }
				}
			});
			document.querySelector("#video-box").srcObject = stream;
		} catch (e) {
			alert(e.name + "\n Parece que no tenés una cámara habilitada en éste dispositivo");
		}
	}
	return {};
})();
