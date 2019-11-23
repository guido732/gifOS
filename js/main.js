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

document.querySelector("#search-bar").oninput = function(e) {
	const $searchButton = document.querySelector("#search-button");
	if (e.target.value !== "") {
		$searchButton.disabled = false;
	} else {
		$searchButton.disabled = true;
	}
};
