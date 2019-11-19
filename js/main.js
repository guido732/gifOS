// TODO close on click outside
// https://www.blustemy.io/detecting-a-click-outside-an-element-in-javascript/
document.querySelector("#dropdown-btn").onclick = function(e) {
	e.preventDefault();
	const $dropdownList = document.querySelector("#dropdown-list");
	$dropdownList.style.display = $dropdownList.style.display === "block" ? "none" : "block";
};
