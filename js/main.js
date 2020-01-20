"use strict";

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
const events = {
	events: {},
	on: function(eventName, ...fn) {
		fn.forEach(inputFn => {
			this.events[eventName] = this.events[eventName] || [];
			this.events[eventName].push(inputFn);
		});
	},
	off: function(eventName, fn) {
		if (this.events[eventName]) {
			for (let i = 0; i < this.events[eventName].length; i++) {
				if (this.events[eventName][i] === fn) {
					this.events[eventName].splice(i, 1);
					break;
				}
			}
		}
	},
	emit: function(eventName, data) {
		if (this.events[eventName]) {
			this.events[eventName].forEach(function(fn) {
				fn(data);
			});
		}
	}
};
const navBar = (() => {
	// Local variables
	const colorThemes = ["sailor_day", "sailor_night"];

	// Cache DOM
	const $navItems = document.querySelector("#nav-items");
	const $homeButton = document.querySelector("#home-button");

	const $themeSelector = document.querySelector("#theme-selector");
	const $dropdownList = document.querySelector("#dropdown-list");
	const $colorThemeOptions = document.querySelectorAll(".color-theme-option");
	const $styleSheet = document.querySelector("#color-theme-stylesheet");
	const $favicon = document.querySelector("#favicon");

	const $btnMyGifs = document.querySelector("#btn-my-gifs");
	const $btnCreateGif = document.querySelector("#btn-create-gif");

	// Bind events
	events.on("pageLoad", loadColorTheme);
	$homeButton.addEventListener("click", () => {
		// Takes user to default window view
		events.emit("gotoHome");
		mount();
	});
	$themeSelector.addEventListener("click", () => {
		// Dropdown list visibility toggle
		$dropdownList.classList.toggle("hidden");
	});
	window.addEventListener("click", e => {
		events.emit("closeOpenedElements");
		// Closes dropdown on click outside or "Escape" keypress
		!e.target.closest("#theme-selector") ? hideElements($dropdownList) : null;
	});
	document.addEventListener("keydown", e => {
		if (e.key === "Escape") {
			hideElements($dropdownList);
			events.emit("closeOpenedElements");
		}
	});
	$colorThemeOptions.forEach((colorThemeOption, index) => {
		colorThemeOption.onclick = () => {
			setColorTheme(colorThemes[index]);
		};
	});
	$btnMyGifs.addEventListener("click", showMyGifsSection);
	$btnCreateGif.addEventListener("click", showCreateGifSection);

	function loadColorTheme() {
		localStorage.getItem("colorTheme")
			? setColorTheme(localStorage.getItem("colorTheme"))
			: setColorTheme(colorThemes[0]);
	}
	function setColorTheme(selectedColorTheme) {
		$styleSheet.setAttribute("href", `./css/themes/${selectedColorTheme}.min.css`);
		$favicon.setAttribute("href", `./assets/img/favicon/${selectedColorTheme || "sailor_day"}.ico`);
		localStorage.setItem("colorTheme", selectedColorTheme);
	}
	function showMyGifsSection() {
		events.emit("myGifs");
	}
	function showCreateGifSection() {
		events.emit("createGif");
		hideElements($navItems);
	}
	function mount() {
		showElements($navItems, $homeButton);
	}
})();
const searchSection = (() => {
	// Cache DOM
	const $searchBox = document.querySelector("#search-box");
	const $searchBar = document.querySelector("#search-bar");
	const $searchButton = document.querySelector("#search-button");
	const $searchSuggestions = document.querySelector("#search-suggestions");
	const $searchTags = document.querySelector("#search-tags");
	const $searchResultsSection = document.querySelector("#search-results-section");
	const $searchResultTitle = document.querySelector("#search-results-input");
	const $searchResulsContainer = document.querySelector("#search-result-container");

	// Bind events
	events.on("pageLoad", mount, () => $searchBar.focus());
	events.on("gotoHome", mount, hideSearchResults, () => $searchBar.focus());
	events.on("closeOpenedElements", hideSearchSuggestions);
	events.on("searchBarInputChanged", searchBarInputChanged);
	events.on("myGifs", unmount);
	events.on("createGif", unmount);
	events.on("searchStarted", hideSearchSuggestions);

	document.searchform.addEventListener("submit", e => {
		// Gets search results from form submission
		e.preventDefault();
		handleSearchFunctionality($searchBar.value);
	});
	$searchBar.addEventListener("input", e => {
		events.emit("searchBarInputChanged", e.target.value);
	});

	function mount() {
		showElements($searchBox);
	}
	function unmount() {
		hideElements($searchBox, $searchResultsSection, $searchTags);
	}
	function hideSearchSuggestions() {
		hideElements($searchSuggestions);
	}
	function hideSearchResults() {
		hideElements($searchResultsSection, $searchTags);
	}
	function searchBarInputChanged(inputValue) {
		if (inputValue !== "") {
			$searchButton.disabled = false;
			handleSearchSuggestionSearch(8, inputValue);
		} else {
			$searchButton.disabled = true;
			hideSearchSuggestions();
		}
	}
	async function handleSearchFunctionality(searchValue) {
		$searchResultTitle.setAttribute("placeholder", `Resultados de búsqueda: ${searchValue}`);
		$searchBar.value = "";
		$searchBar.focus();
		$searchButton.disabled = true;
		$searchResulsContainer.innerHTML = "";
		await fetchSearchResultGifs(16, searchValue);
		events.emit("searchStarted");
		$searchSuggestions.innerHTML = "";
		await showElements($searchResultsSection, $searchTags);
	}
	async function handleSearchSuggestionSearch(limit, keywords) {
		const processedKeywords = processSearchValues(keywords);
		const url = `https://api.giphy.com/v1/gifs/search?q=${processedKeywords}&api_key=${APIkey}&limit=${limit}`;
		const searchResults = await fetchURL(url);
		$searchSuggestions.innerHTML = "";
		showElements($searchSuggestions);
		searchResults.data.length
			? searchResults.data.forEach(searchTitle => {
					searchTitle.title && searchTitle.title !== " "
						? $searchSuggestions.append(newElement("searchTitle", searchTitle))
						: null;
			  })
			: hideElements($searchSuggestions);

		const $searchSuggestionsButtons = document.querySelectorAll(".btn-search-suggestion");
		$searchSuggestionsButtons.forEach(element => {
			element.onclick = () => {
				handleSearchFunctionality(element.innerText);
			};
		});
	}
	async function fetchSearchResultGifs(limit, keywords) {
		const processedKeywords = processSearchValues(keywords);
		const searchResults = await fetchURL(
			`https://api.giphy.com/v1/gifs/search?q=${processedKeywords}&api_key=${APIkey}&limit=${limit}`
		);
		await searchResults.data.forEach(gif => {
			let aspectRatio = "";
			gif.images["480w_still"].width / gif.images["480w_still"].height >= 1.5 ? (aspectRatio = "item-double") : null;
			$searchResulsContainer.append(newElement("trend", gif, aspectRatio));
		});

		// Fit grids so no gaps are visible by having only a pair number of item-double elements
		const itemsDoubleSpan = await document.querySelectorAll("#search-results .item-double");
		if ((await itemsDoubleSpan.length) % 2 !== 0 && (await itemsDoubleSpan.length) > 1) {
			itemsDoubleSpan[itemsDoubleSpan.length - 1].classList.remove("item-double");
		}

		$searchTags.innerHTML = "";
		searchResults.data.map(element => {
			element.title && element.title !== " " && element.title !== "&emsp;"
				? $searchTags.appendChild(newElement("tag", element))
				: null;
		});

		document.querySelectorAll(".btn-tag").forEach(tag => {
			tag.onclick = () => {
				handleSearchFunctionality(tag.innerText);
			};
		});
	}
})();
const suggestionsSection = (() => {
	// Local variables
	const suggestionTopics = [
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

	// Cache DOM
	const $suggestionsSection = document.querySelector("#suggestions-section");
	const $suggestedGifs = document.querySelector("#suggested-container");

	// Bind events
	events.on("pageLoad", render, mount);
	events.on("gotoHome", mount);
	events.on("myGifs", unmount);
	events.on("createGif", unmount);
	events.on("searchStarted", unmount);

	function mount() {
		showElements($suggestionsSection, $suggestedGifs);
	}
	function unmount() {
		hideElements($suggestionsSection);
	}
	function render() {
		fetchSuggestionGifs(4);
	}
	async function fetchSuggestionGifs(limit) {
		const suggestion = getRandomElement(suggestionTopics);
		const gifsSuggestions = await fetchURL(
			`https://api.giphy.com/v1/gifs/search?q=${suggestionTopics[suggestion]}&api_key=${APIkey}&limit=${limit}`
		);
		gifsSuggestions.data.forEach(gif => {
			$suggestedGifs.append(newElement("window", gif));
		});
	}
	function getRandomElement(array) {
		return Math.floor(Math.random() * (array.length - 1));
	}
})();
const trendingSection = (() => {
	// Local variables
	const amountOfTrendingGifs = 16;
	// Cache DOM
	const $trendsSection = document.querySelector("#trends-section");
	const $trendingGifs = document.querySelector("#trend-grid");

	// Bind events
	events.on("pageLoad", render, mount);
	events.on("gotoHome", mount);
	events.on("myGifs", unmount);
	events.on("createGif", unmount);
	events.on("searchStarted", unmount);

	function mount() {
		showElements($trendsSection, $trendingGifs);
	}
	function unmount() {
		hideElements($trendsSection, $trendingGifs);
	}
	function render() {
		fetchTrendingGifs(amountOfTrendingGifs);
	}
	async function fetchTrendingGifs(limit) {
		const gifOffset = Math.floor(Math.random() * 50);
		const gifsTrending = await fetchURL(
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
})();
const createGifsSection = (() => {
	// Local variables
	let totalTime = 0;
	let newGifId = "";
	let videoRecorder;
	let gifRecorder;
	let gifSrc;

	// Cache DOM
	const $stage1 = document.querySelector("#stage1");
	const $stage2 = document.querySelector("#stage2");
	const $stage3 = document.querySelector("#stage3");
	const $stage4 = document.querySelector("#stage4");
	const $stage5 = document.querySelector("#stage5");
	const $stage6 = document.querySelector("#stage6");
	const $stage7 = document.querySelector("#stage7");
	const $createGifHeader = document.querySelector("#create-gif-section-header");
	const $createGifSection = document.querySelector("#create-gif-section");
	const $endProcess = document.querySelectorAll(".close-window");
	const $createGifContinue = document.querySelector("#create-gif-continue");
	const $startRecording = document.querySelector("#start-recording");
	const $stopRecording = document.querySelector("#stop-recording");
	const $redoRecording = document.querySelector("#redo-recording");
	const $uploadRecording = document.querySelectorAll(".gif-upload");
	const $copyGifLink = document.querySelector("#copy-link");
	const $downloadGif = document.querySelector("#download-gif");
	const $inputPreview = document.querySelector("#video-box");
	const $outputPreview = document.querySelector("#gif-preview");
	const $errorMsg = document.querySelector("#error-msg");
	const $errorImg = document.querySelector("#error-img");
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

	events.on("createGif", mount);
	events.on("gotoHome", unmount);
	events.on("searchStarted", unmount);

	// Bind events
	$createGifContinue.onclick = async () => {
		hideElements($stage1, $stage3);
		showElements($stage2, $startRecording);
		try {
			await initiateWebcam();
		} catch (e) {
			// TODO - styled modal popup
			alert(e.name + "\n Parece que no tenés una cámara habilitada en éste dispositivo");
			$startRecording.disabled = true;
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
	$uploadRecording.forEach(uploadSubmission => {
		uploadSubmission.onclick = async () => {
			$createGifHeader.innerText = "Subiendo Guifo";
			hideElements($stage2, $stage7);
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
					await events.emit("myGifsChanged");
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
				const errorGif = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${APIkey}&tag=fail`);
				let errorData = await errorGif.json();
				$errorImg.src = await errorData.data.image_url;
				$errorMsg.innerText = `${e.name}\n${e.message}`;
			}
		};
	});
	$playPreview.onclick = () => {
		myLoadingBar.start(totalTime / 100);
		$inputPreview.play();
	};
	$endProcess.forEach(element => {
		element.addEventListener("click", () => {
			unmount();
			events.emit("createGifEnded");
		});
	});
	$copyGifLink.onclick = () => {
		copyCreatedGifLink();
	};
	$downloadGif.onclick = () => {
		downloadCreatedGif();
	};

	function mount() {
		hideElements($stage2, $stage3, $stage4, $stage5, $stage6, $stage7);
		showElements($createGifSection, $stage1);
	}
	function unmount() {
		hideElements($createGifSection, $stage1, $stage2, $stage3, $stage4, $stage5, $stage6, $stage7);
		showElements(document.querySelector(".nav-item-container"));
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
	async function initiateWebcam() {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: false,
			video: {
				height: { max: 480 }
			}
		});
		$inputPreview.srcObject = stream;
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
		// const postUrl = `https://giphy.com/v1/gifs?api_key=${APIkey}`; //Fake url for testing upload fail
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
})();
const myGifsSection = (() => {
	// Local variables
	let myGifs = {};

	// Cache DOM
	const $myGifsSection = document.querySelector("#my-gifs-section");
	const $gifsGrid = document.querySelector("#my-gifs-grid");

	// Bind events
	events.on("myGifs", mount);
	events.on("myGifsChanged", render);
	events.on("createGif", mount);
	events.on("createGifEnded", mount);
	events.on("gotoHome", unmount);
	events.on("searchStarted", unmount);

	function mount() {
		showElements($myGifsSection, $gifsGrid);
		render();
	}
	function unmount() {
		hideElements($myGifsSection, $gifsGrid);
	}
	function render() {
		myGifs = {};
		let gifIds = "";
		$gifsGrid.innerHTML = "";
		Object.keys(localStorage).forEach(element => {
			element.substring(0, 3) === "gif" ? (myGifs[element] = localStorage.getItem(element)) : null;
		});
		if (!isEmpty(myGifs)) {
			for (let key in myGifs) {
				gifIds += `${myGifs[key]},`;
			}
			gifIds = gifIds.slice(0, -1);
			fetchMyGifs(gifIds);
		}
	}
	async function fetchMyGifs(gifIds) {
		const searchResults = await fetchURL(`https://api.giphy.com/v1/gifs?api_key=${APIkey}&ids=${gifIds}`);
		await searchResults.data.forEach(gif => {
			let aspectRatio = "";
			gif.images["480w_still"].width / gif.images["480w_still"].height >= 1.5 ? (aspectRatio = "item-double") : null;
			$gifsGrid.append(newElement("trend", gif, aspectRatio));
		});
	}
})();

// Local variables
const APIkey = "KvIjm5FP077DsfgGq2kLnXDTViwRJP7f";

// On Load functions
events.emit("pageLoad");

// Generic functions
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
	return inputValues.split(" ").join("+");
}
function isEmpty(obj) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) return false;
	}
	return true;
}

/* 
	// Current list of events:
	
	pageLoad -> onLoad event to set initial states
	gotoHome -> Default view, menu/searchbox/trending/suggestions visible, rest invisible
	myGifsChanged -> list of mygifs has changed, myGifsGrid needs to re-render
	createGifEnded -> triggered by any of the close buttons during gif creation, takes you to mygifs view and re-renders
	searchStarted -> submits search - starts search functionality
	myGifs -> starts myGifs section
	createGif -> starts createGif section
	closeOpenedElements -> event launched when clicking on body of page or pressing scape funciton to close suggestions and modals

*/
