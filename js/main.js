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

window.onload = () => {
	const APIkey = "KvIjm5FP077DsfgGq2kLnXDTViwRJP7f";
	const $suggestedGifsContainer = document.querySelector("#suggested-container");
	const gifOffset = Math.floor(Math.rand * 100);

	const trendingGifs = fetch(
		`http://api.giphy.com/v1/gifs/trending?api_key=${APIkey}&limit=4&rating=r&offset=${gifOffset}`
	)
		.then(response => {
			return response.json();
		})
		.then(data => {
			console.log(data.data[0]);
			data.data.forEach(gif => {
				const $newContainer = document.createElement("div");
				const $newElement = `
				<div class="window-item">
				<div class="wi-header">
					${gif.title}
					<button class="remove-element"></button>
				</div>
				<div class="img-container">
					<img class="img-element" src="${gif.images.original.url}" />
					<button type="button" class="btn-primary tag"><span>Ver más...</span></button>
				</div>
			</div>`;

				$newContainer.innerHTML = $newElement;
				$suggestedGifsContainer.append($newContainer.firstChild);
			});
			// return data;
		})
		.catch(error => {
			console.log("error");
			return error;
		});
};

function newGifItem(type, url) {
	if (type === "window") {
	}
}
