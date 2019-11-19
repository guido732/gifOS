// Dropdown list visibility toggle
document.querySelector("#dropdown-btn").onclick = function(e) {
	e.preventDefault();
	const $dropdownList = document.querySelector("#dropdown-list");
	$dropdownList.style.display = $dropdownList.style.display === "block" ? "none" : "block";
};

// Closes dropdown on click outside
document.onclick = function(e) {
	if (e.target === document.querySelector("body")) {
		$dropdownList.style.display = "none";
	}
};
