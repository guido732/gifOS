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
const colorThemes = ["sailor_day", "sailor_night"];

// Fetch new items on page load for trending and suggestions section
window.onload = () => {
	fetchSuggestionGifs(4);
	fetchTrendingGifs(16);
	document.querySelector("#search-bar").focus();
	localStorage.getItem("colorTheme")
		? setColorTheme(localStorage.getItem("colorTheme"))
		: setColorTheme(colorThemes[0]);
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
document.querySelectorAll(".color-theme-option").forEach((colorThemeBtn, index) => {
	colorThemeBtn.onclick = () => {
		setColorTheme(colorThemes[index]);
	};
});

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

	// Fits grid elements so no gaps are visible by having only a pair number of item-double elements
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
	showElements(
		document.querySelector("#create-gif"),
		document.querySelector("#stage1"),
		document.querySelector("#my-gifs")
	);
}
function setColorTheme(selectedColorTheme) {
	const $styleSheet = document.querySelector("#color-theme-stylesheet");
	const $favicon = document.querySelector("#favicon");
	$styleSheet.setAttribute("href", `./css/themes/${selectedColorTheme}.min.css`);
	$favicon.setAttribute("href", `./assets/img/favicon/${selectedColorTheme || "sailor_day"}.ico`);
	localStorage.setItem("colorTheme", selectedColorTheme);
}

const myGifsSection = () => {
	// Local variables
	let totalTime = 0;
	let myGifs = {};
	let newGifId = "";

	// Cache DOM
	const $gifsGrid = document.querySelector("#my-gifs-grid");
	const $createGifContinue = document.querySelector("#create-gif-continue");
	const $createGifHeader = document.querySelector("#create-gif-section-header");
	const $startRecording = document.querySelector("#start-recording");
	const $stopRecording = document.querySelector("#stop-recording");
	const $redoRecording = document.querySelector("#redo-recording");
	const $retryUpload = document.querySelector("#retry-upload");
	const $errorMsg = document.querySelector("#error-msg");
	const $errorImg = document.querySelector("#error-img");
	const $copyGifLink = document.querySelector("#copy-link");
	const $donwloadGif = document.querySelector("#download-gif");
	const $endProcess = document.querySelectorAll(".close-window");
	const $uploadRecording = document.querySelector("#upload-gif");
	const $stage1 = document.querySelector("#stage1");
	const $stage2 = document.querySelector("#stage2");
	const $stage3 = document.querySelector("#stage3");
	const $stage4 = document.querySelector("#stage4");
	const $stage5 = document.querySelector("#stage5");
	const $stage6 = document.querySelector("#stage6");
	const $stage7 = document.querySelector("#stage7");
	const $inputPreview = document.querySelector("#video-box");
	const $outputPreview = document.querySelector("#gif-preview");
	// Timer elements
	const $timer = document.querySelector("#timer");
	// Loading Bar elements
	const $timerLoadingBar = document.querySelector("#timer-loading-bar");
	const $playPreview = document.querySelector("#btn-play-gif");
	const $previewProgressBlocks = document.querySelectorAll("#loading-bar .progress-block");
	const $uploadProgressBlocks = document.querySelectorAll("#upload-loading-bar .progress-block");

	// Timer + Stopwatch inicialization
	const myStopwatch = Stopwatch($timer, { delay: 10 });
	const myLoadingBar = LoadingBar($previewProgressBlocks);
	const uploadLoadingBar = LoadingBar($uploadProgressBlocks);

	// Bind events
	$createGifContinue.onclick = () => {
		hideElements($stage1, $stage3);
		showElements($stage2, $startRecording);
		try {
			initiateWebcam();
		} catch (e) {
			// TODO - styled modal popup
			alert(e.name + "\n Parece que no tenés una cámara habilitada en éste dispositivo");
		}
	};
	$startRecording.onclick = () => {
		$createGifHeader.innerText = "Capturando tu Guifo";
		hideElements($startRecording, $timerLoadingBar, $stage4);
		showElements($stage3, $stopRecording);
		startRecording();
		myStopwatch.reset();
		myStopwatch.start();
	};
	$stopRecording.onclick = () => {
		$createGifHeader.innerText = "Vista Previa";
		hideElements($stopRecording);
		showElements($stage4, $timerLoadingBar);
		stopRecording();
		totalTime = myStopwatch.stop();
	};
	$redoRecording.onclick = async () => {
		showElements($stopRecording, $inputPreview);
		hideElements($stage4, $timerLoadingBar);
		$createGifHeader.innerText = "Capturando tu Guifo";
		await initiateWebcam();
		await startRecording();
		myStopwatch.reset();
		myStopwatch.start();
		myLoadingBar.stop();
	};
	$uploadRecording.onclick = async () => {
		$createGifHeader.innerText = "Subiendo Guifo";
		hideElements($stage2);
		showElements($stage5);
		uploadLoadingBar.loop();
		myLoadingBar.stop();
		try {
			const newGif = await uploadCreatedGif();
			if ((await newGif.meta.status) === 200) {
				newGifId = await newGif.data.id;
				saveGifToLocalStorage(await newGif.data.id);
				await hideElements($stage5);
				await showElements($stage6);
				await uploadLoadingBar.stop();
				await _render();
			} else {
				await showElements($stage7);
				await hideElements($stage5);
				await uploadLoadingBar.stop();
				$errorMsg.innerText = `${e.name}\n${e.message}`;
			}
		} catch (e) {
			$errorImg.src = "";
			await showElements($stage7);
			await hideElements($stage5);
			await uploadLoadingBar.stop();
			const errorGif = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${APIkey}&tag=error`);
			errorData = await errorGif.json();
			$errorImg.src = await errorData.data.image_url;
			$errorMsg.innerText = `${e.name}\n${e.message}`;
		}
	};
	$retryUpload.onclick = async () => {
		$createGifHeader.innerText = "Subiendo Guifo";
		hideElements($stage7);
		showElements($stage5);
		uploadLoadingBar.loop();
		try {
			const newGif = await uploadCreatedGif();
			if ((await newGif.meta.status) === 200) {
				newGifId = await newGif.data.id;
				saveGifToLocalStorage(await newGif.data.id);
				await hideElements($stage5);
				await showElements($stage6);
				await uploadLoadingBar.stop();
				await _render();
			} else {
				await showElements($stage7);
				await hideElements($stage5);
				await uploadLoadingBar.stop();
				$errorMsg.innerText = `${e.name}\n${e.message}`;
			}
		} catch (e) {
			$errorImg.src = "";
			await showElements($stage7);
			await hideElements($stage5);
			await uploadLoadingBar.stop();
			const errorGif = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${APIkey}&tag=error`);
			errorData = await errorGif.json();
			$errorImg.src = await errorData.data.image_url;
			$errorMsg.innerText = `${e.name}\n${e.message}`;
		}
	};
	$playPreview.onclick = () => {
		myLoadingBar.start(totalTime / 100);
		$inputPreview.play();
	};
	$endProcess.forEach(element => {
		element.addEventListener("click", () => {
			hideElements($stage1, $stage2, $stage5, $stage6, $stage7);
			showElements(document.querySelector(".nav-item-container"));
		});
	});
	$copyGifLink.onclick = () => {
		copyCreatedGifLink();
	};
	$donwloadGif.onclick = () => {
		downloadCreatedGif();
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
	}
	function saveGifToLocalStorage(gifId) {
		localStorage.setItem(`gif-${gifId}`, gifId);
	}
	function copyCreatedGifLink() {
		const tempElement = document.createElement("textarea");
		tempElement.value = `https://giphy.com/gifs/${newGifId}`;
		tempElement.setAttribute("readonly", "");
		tempElement.style = 'display: "none"';
		document.body.appendChild(tempElement);
		tempElement.select();
		document.execCommand("copy");
		console.log("Copied data to clipboard!");
		document.body.removeChild(tempElement);
	}
	async function downloadCreatedGif() {
		const downloadUrl = `https://media.giphy.com/media/${newGifId}/giphy.gif`;
		const fetchedGif = fetch(downloadUrl);
		const blobGif = (await fetchedGif).blob();
		const urlGif = URL.createObjectURL(await blobGif);
		const saveImg = document.createElement("a");
		saveImg.href = urlGif;
		saveImg.download = "downloaded-guifo.gif";
		saveImg.style = 'display: "none"';
		document.body.appendChild(saveImg);
		saveImg.click();
		document.body.removeChild(saveImg);
	}
	async function fetchMyGifs(gifIds) {
		searchResults = await fetchURL(`https://api.giphy.com/v1/gifs?api_key=${APIkey}&ids=${gifIds}`);
		await searchResults.data.forEach(gif => {
			let aspectRatio = "";
			gif.images["480w_still"].width / gif.images["480w_still"].height >= 1.5 ? (aspectRatio = "item-double") : null;
			$gifsGrid.append(newElement("trend", gif, aspectRatio));
			// console.log("element appended");
		});
	}
	async function initiateWebcam() {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: false,
			video: {
				height: { max: 480 }
			}
		});
		$inputPreview.srcObject = await stream;
		await $inputPreview.play();
	}
	async function startRecording() {
		const stream = $inputPreview.srcObject;
		videoRecorder = new RecordRTCPromisesHandler(stream, {
			type: "video",
			mimeType: "video/webm; codecs=vp8",
			disableLogs: true,
			videoBitsPerSecond: 128000,
			frameRate: 30,
			quality: 10,
			width: 480,
			hidden: 240
		});
		gifRecorder = new RecordRTCPromisesHandler(stream, {
			disableLogs: true,
			type: "gif",
			frameRate: 1,
			quality: 10,
			width: 360,
			hidden: 240,
			onGifPreview: function(gifURL) {
				$outputPreview.src = gifURL;
			}
		});
		await videoRecorder.startRecording();
		await gifRecorder.startRecording();
		// helps releasing camera on stopRecording
		videoRecorder.stream = stream;
	}
	async function stopRecording() {
		await videoRecorder.stopRecording();
		$inputPreview.srcObject = null;
		const videoBlob = await videoRecorder.getBlob();
		$inputPreview.src = URL.createObjectURL(videoBlob);
		videoRecorder.stream.getTracks(t => t.stop());
		// reset Recorder's state & clear the memory
		await videoRecorder.reset();
		await videoRecorder.destroy();

		await gifRecorder.stopRecording();
		const gifBlob = await gifRecorder.getBlob();
		gifSrc = await gifBlob;
		$outputPreview.src = URL.createObjectURL(await gifBlob);
		await gifRecorder.destroy();
		gifRecorder = await null;
	}
	async function uploadCreatedGif() {
		console.log("***Upload started***");
		const formData = new FormData();
		formData.append("file", gifSrc, "myGif.gif");
		// const postUrl = "https://cors-anywhere.herokuapp.com/" + `https://upload.giphy.com/v1/gifs?api_key=${APIkey}`;
		// const postUrl = `https://giphy.com/v1/gifs?api_key=${APIkey}`;				//Fake url for testing upload fail
		const postUrl = `https://upload.giphy.com/v1/gifs?api_key=${APIkey}`;
		const response = await fetch(postUrl, {
			method: "POST",
			body: formData,
			json: true
		});
		const data = await response.json();
		console.log(await data);
		console.log("***Upload ended***");
		return await data;
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
const LoadingBar = subElems => {
	// Local variables
	let progress = 0;
	let interval;

	function start(totalTime = 100) {
		stop();
		interval = setInterval(frame, totalTime);
		function frame() {
			if (progress >= 100) {
				clearInterval(interval);
			} else {
				progress++;
				let progCounter = Math.floor(progress / (100 / subElems.length));
				progCounter > subElems.length - 1 ? (progCounter = subElems.length - 1) : null;
				subElems[progCounter].classList.remove("empty");
			}
		}
	}
	function stop() {
		clearInterval(interval);
		progress = 0;
		subElems.forEach(elem => {
			elem.classList.add("empty");
		});
	}
	function loop(totalTime = 10) {
		stop();
		interval = setInterval(frame, totalTime);
		function frame() {
			if (progress >= 100) {
				stop();
				interval = setInterval(frame, totalTime);
			} else {
				progress++;
				let progCounter = Math.floor(progress / (100 / subElems.length));
				progCounter > subElems.length - 1 ? (progCounter = subElems.length - 1) : null;
				subElems[progCounter].classList.remove("empty");
			}
		}
	}
	// Public Functions
	return {
		start: start,
		stop: stop,
		loop: loop
	};
};
