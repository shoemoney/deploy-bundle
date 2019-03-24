// Consts
const forms = [{
	trigger: "projectfrm",
	path: "/project/add",
	label: "Project Submission",
	fields: ["	creator", "	stack", "	title", "	description", "	source", "	demo", "	other"]
},
{
	trigger: "docfrm",
	path: "/application/add",
	label: "Doc Application",
	fields: ["name", "languages", "learn", "time", "info"]
}];

const api = 'http://localhost:5501';

// Functions

/**
 * Meaningful info here
 *
 * @param {e} event - Click event. AUTOMATIC
 */
const openForm = (e) => {
	let workingStr = '';
	forms.forEach((set) => {
		if (set.trigger == e.target.id) {
			workingStr += `<label for="${set.trigger}">${set.label}</label><br>`;
			set.fields.forEach((el) => {
				let fromStorage = window.localStorage.getItem(el);
				window.localStorage.removeItem(el);
				console.log(fromStorage);
				fromStorage = fromStorage ? ` value="${fromStorage}"` : '' ;
				workingStr += `<label for="${el}">${el}</label>`;
				workingStr += `<input type="text" name="${el}"${fromStorage}><br>`;
			});
		}
	});
	workingStr += '<div id="submit">click to submit</div>';
	workingStr += '<div id="close">close form</div>';
	document.getElementById("form").innerHTML = '';
	document.getElementById("form").innerHTML = workingStr;

	document.getElementById("close").addEventListener("click", closeForm);
	document.getElementById("submit").addEventListener("click", submitForm);
}

/**
 * Meaningful info here
 * 
 */
const closeForm = () => {
	let workingForm = document.getElementById("form");
	if (storageAvailable('localStorage')) {
		Array.from(workingForm.children).forEach((el) => {
			if (el.tagName == "INPUT" && el.value.length) {
				window.localStorage.setItem(el.name, el.value);
			}
		})
	} else {
		confirm("Form will be cleared! Continue?");
	}
	document.getElementById("close").removeEventListener("click", closeForm);
	document.getElementById("submit").removeEventListener("click", submitForm);
	workingForm.innerHTML = "";
}

/**
 * Meaningful info here
 *
 * @param {e} event - Click event. AUTOMATIC
 * @returns {false} false - Returns false if not all fields have data. CONDITONAL
 */
const submitForm = (e) => {
	let find =  e.target.parentNode.firstChild.htmlFor;
	console.log(find);
	let workObj = darkMagix(forms, find);
	console.log(workObj)
	let sendObj = {};
	let giveErr = [];
	let workingForm = document.getElementById("form");
	Array.from(workingForm.children).forEach((el) => {
		if (el.tagName == "INPUT" && el.value.length) {
			sendObj[el.name] = el.value;
		} else if (el.tagName == "INPUT") {
			giveErr.push(el.name);
		}
	})
	if (giveErr.length) {
		alert(`Please fill out these fields:\n${giveErr}`);
		return false;
	} else {
		console.log(sendObj),
		doFetch(`${api}${workObj.path}`, "POST", sendObj)
		.then(res => {
			if (res.status >= 400) {
				alert(`Error code: ${res.status}\nError Message: ${res.statusText}`);
			} else {
				console.log(res);
				document.getElementById("form").innerHTML = '';
			}
		});
	}
}

/**
 * Meaningful info here
 *
 * @param {check} string - Must be a valid url
 * @param {target} string - GET or POST expected. OPTIONAL
 * @returns {check[i]} object - Returns matched object
 */
const darkMagix = (check, target) => {
	for (i = 0; i < check.length; i++) {
		if (check[i].trigger == target) {
			return check[i];
		}
	}
	return false;
}

/**
 * Meaningful info here
 *
 * @param {url} string - Must be a valid url
 * @param {type} string - GET or POST expected. OPTIONAL
 * @param {data} string - Data for POST, JSON object expected. OPTIONAL
 * @returns {response} promise - Return from api
 */
const storageAvailable = (type) => {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	} catch (err) {
		return err instanceof DOMException && (
			// everything except Firefox
			err.code === 22 ||
			// Firefox
			err.code === 1014 ||
			// test name field too, because code might not be present
			// everything except Firefox
			err.name === 'QuotaExceededError' ||
			// Firefox
			err.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
			// acknowledge QuotaExceededError only if there's something already stored
			storage.length !== 0;
	}
}

/**
 * Meaningful info here
 *
 * @param {url} string - Must be a valid url
 * @param {type} string - GET or POST expected. OPTIONAL
 * @param {data} string - Data for POST, JSON object expected. OPTIONAL
 * @returns {response} promise - Return from api
 */
const doFetch = (url, type, data) => {
	if (!url) return Error("no URL supplied");
	if ((!type || type == "GET") && data) console.log("GET but data supplied! Ignoring data...");
	if (type == "POST" && !data) return Error("no POST data supplied");
	let fetchObj = {
		mode: "cors", // no-cors, cors, *same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, same-origin, *omit
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			// "Content-Type": "application/x-www-form-urlencoded",
		},
		redirect: "follow", // manual, *follow, error
		referrer: "no-referrer" // no-referrer, *client
	}
	if (type) fetchObj.method = type;
	if (type == "POST" && data) {
		fetchObj.body = JSON.stringify(data); // body data type must match "Content-Type" header
	}
	return fetch(url, fetchObj)
	.catch(err => console.log(err));
}

window.onload = function() {
	document.getElementById("projectfrm").addEventListener("click", openForm)
	document.getElementById("docfrm").addEventListener("click", openForm)
};
