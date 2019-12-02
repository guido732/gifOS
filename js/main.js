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

	const trendingGifs = fetch(`http://api.giphy.com/v1/gifs/trending?api_key=${APIkey}&limit=4&rating=r`)
		.then(response => {
			return response.json();
		})
		.then(data => {
			return data;
		})
		.catch(error => {
			return error;
		});

	$suggestedGifsContainer.appendChild();
};

function newGifItem (type, url){
	
}