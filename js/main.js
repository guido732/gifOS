// Dropdown list visibility toggle
document.querySelector("#dropdown-btn").onclick = function(e) {
	const $dropdownList = document.querySelector("#dropdown-list");
	e.preventDefault();
	$dropdownList.style.display = $dropdownList.style.display === "block" ? "none" : "block";
};

// Closes dropdown on click outside
document.onclick = function(e) {
	const $dropdownList = document.querySelector("#dropdown-list");
	if (e.target === document.querySelector("body")) {
		$dropdownList.style.display = "none";
	}
};

// Disables submit button if search bar is empty
document.querySelector("#search-bar").oninput = function(e) {
	const $searchButton = document.querySelector("#search-button");
	if (e.target.value !== "") {
		$searchButton.disabled = false;
	} else {
		$searchButton.disabled = true;
	}
};

// Fetch new items on page load for trending and suggestions section
window.onload = () => {
	const APIkey = "KvIjm5FP077DsfgGq2kLnXDTViwRJP7f";
	fetchSuggestions(4, APIkey);
	fetchTrending(20, APIkey);
};

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

async function fetchTrending(limit, APIkey) {
	const $trendingGifs = document.querySelector("#trend-grid");
	const gifOffset = Math.floor(Math.random() * 50);

	gifsTrending = await fetchURL(
		`http://api.giphy.com/v1/gifs/trending?api_key=${APIkey}&limit=${limit}&rating=r&offset=${gifOffset}`
	);
	gifsTrending.data.forEach(gif => {
		let aspectRatio = "";
		gif.images["480w_still"].width / gif.images["480w_still"].height >= 1.5 ? (aspectRatio = "item-double") : null;
		$trendingGifs.append(newGifItem("trend", gif, aspectRatio));
	});
}

async function fetchSuggestions(limit, APIkey) {
	const $suggestedGifs = document.querySelector("#suggested-container");
	const suggestionArray = [
		"baby+yoda",
		"puppy",
		"kitten",
		"oh+shit",
		"rick+morty",
		"the+office",
		"sillicon+valley",
		"lol",
		"the+mandalorian",
		"pulp+fiction",
		"fight+club",
		"wtf",
		"shocked"
	];
	const suggestion = Math.floor(Math.random() * (suggestionArray.length - 1));

	gifsSuggestions = await fetchURL(
		`http://api.giphy.com/v1/gifs/search?q=${suggestionArray[suggestion]}&api_key=${APIkey}&limit=${limit}&rating=r`
	);

	gifsSuggestions.data.forEach(gif => {
		$suggestedGifs.append(newGifItem("window", gif));
	});
}

function newGifItem(type, gif, ratio = "") {
	// gif.title === "" ? (gif.title = "&emsp;") : null;
	const $container = document.createElement("div");
	let $element = "";
	switch (type) {
		case "window":
			$element = `<div class="window-item ${ratio}">
				<div class="wi-header">
						${gif.title}
					<button class="remove-element"></button>
				</div>
				<div class="img-container">
					<img class="img-element" src="${gif.images.original.url}" />
					<a href="${gif.bitly_url}" target="_blank" type="button" class="btn-primary tag"><span>Ver más...</span></a>
				</div>
			</div>`;
			$container.innerHTML = $element;
			return $container.firstChild;
		case "trend":
			const titleToArray = gif.title.split(" ");
			let titleArrayToTags = "";
			titleToArray.forEach(word => {
				titleArrayToTags += `#${word} `;
			});
			$element = `<div class="trend-item ${ratio}">
				<a href="${gif.bitly_url}" target="_blank">
					<img src="${gif.images.original.url}" alt="${gif.title}" class="img-element" />
					<div class="trend-header">
						${titleArrayToTags}
					</div>
				</a>
			</div>
		</div>`;
			$container.innerHTML = $element;
			return $container.firstChild;
	}
}
