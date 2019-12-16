const APIkey = "KvIjm5FP077DsfgGq2kLnXDTViwRJP7f";

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

// Fetch new items on page load for trending section
window.onload = () => {
	fetchSuggestions(4);
	fetchTrending(20);
};

function fetchTrending(limit) {
	const $suggestedGifsContainer = document.querySelector("#trend-grid");
	const gifOffset = Math.floor(Math.random() * 50);
	fetch(`http://api.giphy.com/v1/gifs/trending?api_key=${APIkey}&limit=${limit}&rating=r&offset=${gifOffset}`)
		.then(response => {
			return response.json();
		})
		.then(data => {
			data.data.forEach(gif => {
				let aspectRatio = "";
				gif.images["480w_still"].width / gif.images["480w_still"].height >= 1.5
					? (aspectRatio = "item-double")
					: (aspectRatio = "");
				const newGif = newGifItem("trend", gif, aspectRatio);
				$suggestedGifsContainer.append(newGif);
			});
		})
		.catch(error => {
			return error;
		});
}

function fetchSuggestions(limit) {
	const $suggestedGifsContainer = document.querySelector("#suggested-container");
	const suggestionArray = [
		"baby+yoda",
		"puppy",
		"kitten",
		"oh+shit",
		"rick+morty",
		"the+office",
		"sillicon+valley",
		"lol",
		"wtf",
		"shocked"
	];
	const suggestion = Math.floor(Math.random() * (suggestionArray.length - 1));
	fetch(
		`http://api.giphy.com/v1/gifs/search?q=${suggestionArray[suggestion]}&api_key=${APIkey}&limit=${limit}&rating=r`
	)
		.then(response => {
			return response.json();
		})
		.then(data => {
			data.data.forEach(gif => {
				const newGif = newGifItem("window", gif);
				$suggestedGifsContainer.append(newGif);
			});
		})
		.catch(error => {
			return error;
		});
}

function newGifItem(type, gif, ratio = "") {
	gif.title === "" ? (gif.title = "&emsp;") : null;
	if (type === "window") {
		const $container = document.createElement("div");
		const $element = `<div class="window-item ${ratio}">
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
	} else if (type === "trend") {
		// console.log(gif);
		var titleToArray = gif.title.split(" ");
		var titleArrayToTags = "";
		titleToArray.forEach(word => {
			titleArrayToTags += `#${word} `;
		});
		const $container = document.createElement("div");
		const $element = `<div class="trend-item ${ratio}">
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
