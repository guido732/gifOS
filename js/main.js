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
document.querySelector("#home-button").onclick = e => {
	hideElements(document.querySelector("#create-gif"), document.querySelector("#my-gifs"));
	showElements(
		document.querySelector("#search-box"),
		document.querySelector("#suggestions"),
		document.querySelector("#trends"),
		document.querySelector(".nav-item-container")
	);
};
// Dropdown list visibility toggle
document.querySelector("#dropdown-btn").onclick = e => {
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
document.querySelector("#search-bar").oninput = e => {
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
	const url = `https://api.giphy.com/v1/gifs/search?q=${processedKeywords}&api_key=${APIkey}&limit=${limit}`;
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
		`https://api.giphy.com/v1/gifs/trending?api_key=${APIkey}&limit=${limit}&offset=${gifOffset}`
	);
	await gifsTrending.data.forEach(gif => {
		let aspectRatio = "";
		gif.images["480w_still"].width / gif.images["480w_still"].height >= 1.5 ? (aspectRatio = "item-double") : null;
		$trendingGifs.append(newElement("trend", gif, aspectRatio));
	});

	// Fit girds so no gaps are visible by having only a pair number of item-double elements
	const itemsDoubleSpan = await document.querySelectorAll("#trend-grid .item-double");
	if ((await itemsDoubleSpan.length) % 2 !== 0 && (await itemsDoubleSpan.length) > 1) {
		itemsDoubleSpan[itemsDoubleSpan.length - 1].classList.remove("item-double");
	}
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
		`https://api.giphy.com/v1/gifs/search?q=${suggestionArray[suggestion]}&api_key=${APIkey}&limit=${limit}`
	);

	gifsSuggestions.data.forEach(gif => {
		$suggestedGifs.append(newElement("window", gif));
	});
}
async function fetchSearchResultGifs(limit, keywords) {
	const $searchResultsContainer = document.querySelector("#search-result-container");
	processedKeywords = processSearchValues(keywords);
	searchResults = await fetchURL(
		`https://api.giphy.com/v1/gifs/search?q=${processedKeywords}&api_key=${APIkey}&limit=${limit}`
	);
	await searchResults.data.forEach(gif => {
		let aspectRatio = "";
		gif.images["480w_still"].width / gif.images["480w_still"].height >= 1.5 ? (aspectRatio = "item-double") : null;
		$searchResultsContainer.append(newElement("trend", gif, aspectRatio));
	});

	// Fit girds so no gaps are visible by having only a pair number of item-double elements
	const itemsDoubleSpan = await document.querySelectorAll("#search-results .item-double");
	if ((await itemsDoubleSpan.length) % 2 !== 0 && (await itemsDoubleSpan.length) > 1) {
		itemsDoubleSpan[itemsDoubleSpan.length - 1].classList.remove("item-double");
	}

	const $tagContainer = document.querySelector("#search-tags");
	$tagContainer.innerHTML = "";
	searchResults.data.map(element => {
		element.title && element.title !== " " && element.title !== "&emsp;"
			? $tagContainer.appendChild(newElement("tag", element))
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
				<a href="${element.bitly_url}" target="_blank" type="button" class="btn-primary btn-tag"><span class="btn-text-container" >Ver más...</span></a>
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
			$container.innerHTML = `<button type="button" class="btn-primary btn-tag"><span class="btn-text-container">${element.title}</span></button>`;
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
	myGifsSection();
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
	myGifsSection();
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

const myGifsSection = () => {
	// Cache DOM
	const $createGifWindow = document.querySelector("#create-gif");
	const $myGifsSection = document.querySelector("#my-gifs");
	const $gifsGrid = document.querySelector("#my-gifs-grid");
	const $createGifContinue = document.querySelector("#create-gif-continue");
	const $createGifCancel = document.querySelector("#create-gif-cancel");
	const $createGifHeader = document.querySelector("#create-gif-section-header");
	const $startRecording = document.querySelector("#start-recording");
	const $stopRecording = document.querySelector("#stop-recording");
	const $redoRecording = document.querySelector("#redo-recording");
	const $uploadRecording = document.querySelector("#upload-gif");
	const $stage1 = document.querySelector("#stage1");
	const $stage2 = document.querySelector("#stage2");
	const $stage3 = document.querySelector("#stage3");
	const $stage4 = document.querySelector("#stage4");
	const $inputPreview = document.querySelector("#video-box");
	const $outputPreview = document.querySelector("#gif-preview");
	// Timer
	const $timer = document.querySelector("#timer");
	// Loading Bar
	const $myBar = document.querySelector("#bar");
	const $timerLoadingBar = document.querySelector("#timer-loading-bar");
	const $playPreview = document.querySelector("#btn-play-gif");

	// Local variables
	const myStopwatch = Stopwatch($timer, { delay: 10 });
	const myLoadingBar = LoadingBar($myBar);
	let totalTime = 0;
	let myGifs = {};

	// Bind events
	$createGifContinue.onclick = () => {
		$createGifWindow.firstElementChild.classList.remove("window-size-md");
		$createGifWindow.firstElementChild.classList.add("window-size-lg");
		$createGifHeader.innerText = "Un Chequeo Antes de Empezar";
		hideElements($stage1, $stage3);
		showElements($stage2);
		initiateWebcam();
	};
	$createGifCancel.onclick = () => {
		// TODO Replace for executing component function
		hideElements($createGifWindow, $myGifsSection);
		showElements(
			document.querySelector("#search-box"),
			document.querySelector("#suggestions"),
			document.querySelector("#trends"),
			document.querySelector(".nav-item-container")
		);
	};
	$startRecording.onclick = () => {
		$createGifHeader.innerText = "Capturando tu Guifo";
		hideElements($startRecording, $timerLoadingBar);
		showElements($stopRecording, $stage3);
		startRecording();
		myStopwatch.reset();
		myStopwatch.start();
	};
	$stopRecording.onclick = () => {
		$createGifHeader.innerText = "Vista Previa";
		hideElements($stage4, $inputPreview, $stopRecording);
		showElements($stage4, $outputPreview, $timerLoadingBar);
		stopRecording();
		totalTime = myStopwatch.stop();
	};
	$redoRecording.onclick = async () => {
		showElements($stopRecording, $stage3, $inputPreview);
		hideElements($stage4, $startRecording, $outputPreview);
		$createGifHeader.innerText = "Capturando tu Guifo";
		await initiateWebcam();
		await startRecording();
		myStopwatch.reset();
		myStopwatch.start();

		// $createGifHeader.innerText = "Un Chequeo Antes de Empezar";
		// hideElements($stage1, $stage3, $outputPreview);
		// showElements($stage2, $startRecording, $inputPreview);
		// await stopRecording();
		// await initiateWebcam();
	};
	$uploadRecording.onclick = async () => {
		$createGifHeader.innerText = "Subiendo Guifo";
		await uploadCreatedGif();
		await _render();
	};
	$playPreview.onclick = () => {
		myLoadingBar.start(totalTime / 100);
		/* 
		Replace preview window for video again
		make video NOT play by default
		if video playing -> stop / reset timer / reset loading bar
		if video !playing -> play once / start timer / start loading bar with video max time as param
		*/
	};

	// On Load functions
	_render();

	function _render() {
		myGifs = {};
		$gifsGrid.innerHTML = "";

		Object.keys(localStorage).forEach(element => {
			element.substring(0, 3) === "gif" ? (myGifs[element] = localStorage.getItem(element)) : null;
		});

		let gifIds = "";
		for (let key in myGifs) {
			gifIds += `${myGifs[key]},`;
		}
		gifIds = gifIds.slice(0, -1);
		fetchMyGifs(gifIds);
		console.log("rendered");
	}

	async function fetchMyGifs(gifIds) {
		searchResults = await fetchURL(`https://api.giphy.com/v1/gifs?api_key=${APIkey}&ids=${gifIds}`);
		// console.log(await searchResults);

		await searchResults.data.forEach(gif => {
			let aspectRatio = "";
			gif.images["480w_still"].width / gif.images["480w_still"].height >= 1.5 ? (aspectRatio = "item-double") : null;
			$gifsGrid.append(newElement("trend", gif, aspectRatio));
			// console.log("element appended");
		});
	}
	async function initiateWebcam() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					height: { max: 480 }
				}
			});
			$inputPreview.srcObject = await stream;
			await $inputPreview.play();
		} catch (e) {
			alert(e.name + "\n Parece que no tenés una cámara habilitada en éste dispositivo");
		}
	}
	async function startRecording() {
		const stream = $inputPreview.srcObject;
		recorder = new RecordRTCPromisesHandler(stream, {
			type: "gif",
			mimeType: "video/webm",
			disableLogs: true,
			videoBitsPerSecond: 128000,
			frameRate: 30,
			quality: 10,
			width: 480,
			hidden: 240
		});
		await recorder.startRecording();
		// helps releasing camera on stopRecording
		recorder.stream = stream;
	}
	async function stopRecording() {
		recorder.stopRecording();
		$inputPreview.srcObject = null;
		let blob = await recorder.getBlob();
		$outputPreview.src = await URL.createObjectURL(blob);
		videoSrc = await blob;
		recorder.stream.getTracks(t => t.stop());
		// reset recorder's state & clear the memory
		await recorder.reset();
		await recorder.destroy();
	}
	async function uploadCreatedGif() {
		/* try {
			console.log("***Upload started***");
			const formData = new FormData();
			formData.append("file", videoSrc, "myWebm.gif");

			const postUrl = "https://cors-anywhere.herokuapp.com/" + `https://upload.giphy.com/v1/gifs?api_key=${APIkey}`;
			const response = await fetch(postUrl, {
				method: "POST",
				body: formData,
				json: true
			});
			const data = await response.json();
			console.log(await data);
			console.log("***Upload ended***");
			await localStorage.setItem(`gif-${data.data.id}`, data.data.id);
		} catch (e) {
			console.log(`Error: ${e}\n${e.message}`);
		} */
		setTimeout(() => {
			console.log("gif uploaded");
		}, 1000);
	}

	return {};
};
const Stopwatch = (elem, options) => {
	let timer = elem,
		offset,
		clock,
		interval;

	// default options
	options = options || {};
	options.delay = options.delay || 1;

	// initialize
	reset();

	// private functions
	function start() {
		if (!interval) {
			offset = Date.now();
			interval = setInterval(update, options.delay);
		}
	}
	function stop() {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
		return clock;
	}
	function reset() {
		clock = 0;
		render();
	}
	function update() {
		clock += delta();
		render();
	}
	function delta() {
		let now = Date.now(),
			d = now - offset;
		offset = now;
		return d;
	}
	function msToTime(duration) {
		let milliseconds = parseInt((duration % 1000) / 10),
			seconds = Math.floor((duration / 1000) % 60),
			minutes = Math.floor((duration / (1000 * 60)) % 60),
			hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

		hours = hours < 10 ? "0" + hours : hours;
		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
	}
	function render() {
		timer.innerHTML = msToTime(clock);
	}
	// Exposed Functions
	return {
		start: start,
		stop: stop,
		reset: reset
	};
};
const LoadingBar = elem => {
	// Local variables
	let running = false;

	function start(totalTime = 100) {
		if (!running) {
			running = true;
			let width = 0;
			const id = setInterval(frame, totalTime);
			function frame() {
				if (width >= 100) {
					clearInterval(id);
					running = false;
				} else {
					width++;
					elem.style.width = width + "%";
				}
			}
		}
	}
	function reset() {
		running = false;
	}
	// Public Functions
	return {
		start: start,
		stop: reset
	};
};
