module.exports = {
	on: on,
	removeClass: removeClass,
	currentMenu: currentMenu,
	lock: lock,
	unLock: unLock,
	clearStyle: clearStyle,
	preventPaste: preventPaste,
	preventCopy: preventCopy,
	get: {
		getValue: getValue,
		getText: getText,
		getHTML: getHTML,
		getDate: getDate,
		getNodeList: getNodeList
  	},
  	check: {
		isFileInvalid: isFileInvalid,
		isFilenameInvalid: isFilenameInvalid,
		isFilesizeExceeded: isFilesizeExceeded
  	},
  	options: {
		resourceListOptions: resourceListOptions,
		selectOptions: selectOptions,
		sortableOptions: sortableOptions,
		datePickerOptions: datePickerOptions,
		editorOptions: editorOptions
  	}
};

// add event listener to dynamically created DOM element
function on(selector, eventType, childSelector, eventHandler) {
	const elements = document.querySelectorAll(selector);

    for (element of elements) {
      	element.addEventListener(eventType, eventOnElement => {
			if (eventOnElement.target.matches(childSelector)) {
				eventHandler(eventOnElement);
			}
      	});
    }
}

function removeClass(target, nodeClass) {
	getNodeList(target).forEach( (i) => i.classList.remove(nodeClass) );
}

// get current active form in Settings Menu
function currentMenu() {
    const target = document.getElementsByClassName("modal-active-tab")[0];
    const index = parseInt(target.dataset.tab);

    switch (index) {
        case 1:
            return document.getElementById('modal-add');
        case 2:
            return document.getElementById('modal-edit');
        case 3:
            return document.getElementById('modal-modify');
    }
}

// lock attached file
function lock(filename) {
    const context = currentMenu();
    const target = context.querySelector('.attachment-filename');
	const file = context.querySelector('.btn-file');
    const icon = '<span class="remove-document"></span>';

	file.style = "";
    target.querySelector('input').value = filename;
    target.insertAdjacentHTML('beforeend', icon);
}

// unlock attached file
function unLock(event, form) {
    const context = form ? form : currentMenu();
    const target = context.querySelectorAll('.remove-document');

    if (target.length) {
		const icon = target[0];
		const file = context.querySelector('.attachment-fileinput');
		const filename = context.querySelector('.attachment-filetitle');

		file.value = ""
		filename.value = "";
		icon.remove();
    }
}

function preventPaste() {
	event.preventDefault();
	return false;
}

function preventCopy() {
	event.preventDefault();
	return false;
}

function getNodeList(target) {
	return Array.from(document.querySelectorAll(target));
}

// when inserting missing data in Settings Menu, this function removes red highlighting
function clearStyle() {
	event.target.style = "";
}

// get trimmed value from target DOM input
function getValue(target) {
	return document.querySelectorAll(target)[0].value.trim();
}

// get innerText from target DOM element
function getText(target) {
	return document.querySelectorAll(target)[0].innerText;
}

// get HTML content from target DOM element
function getHTML(target) {
	return document.querySelectorAll(target)[0].innerHTML;
}

// get date from datepicker and convert it to ISO 8601, SharePoint compatible
function getDate(target) {
	const value = document.querySelectorAll(target)[0].value.trim();
	const dateParts = value.split("/").map((i) => parseInt(i));

	try {
		return new Date(dateParts[2], dateParts[1] -1, dateParts[0]).toISOString();
	} catch (error) {
		return false;
	}
}

// check filename for invalid extension
function isFileInvalid(filename) {
	const validExtensions = ["xls", "xlsx", "doc", "docx", "ppt", "pptx", "pdf"];
	const extension = filename.split('.').pop();

	return validExtensions.indexOf(extension) == -1;
}

// check for invalid characters in filename
function isFilenameInvalid(filename) {
	const charList = ['~', '#', '%', '&' , '*', '{', '}', '\\', ':', '<', '>', '?', '/', '|', '"', "'"];

	return filename.split("").some(ch => charList.indexOf(ch) !== -1);
}

// check that filesize does not exceed the maximum amount of 20 MegaBytes
function isFilesizeExceeded(size) {
	const convertedValue = size / 1000000;

	return convertedValue > 20;
}

// options for SortableJS instances in Settings Menu
function sortableOptions(animation, direction, handle) {
	return {
		animation: animation,
		direction: direction,
		handle: handle,
		dataIdAttr: 'data-row'
	};
}

// options for SelectPure instances in Settings Menu
function resourceListOptions(list, placeholder, auto, value) {
	return {
		options: list,
		placeholder: placeholder,
		autocomplete: auto,
		value: value,
		onChange: (value) => {
			const target = document.getElementById('edit-resource');
			const button = document.getElementById('remove-resource').parentNode;
			const item = window.gapmap.data.resources.filter( (i) => i.Title == value )[0];

			document.getElementById('edit-resource').dataset.item = item.Id;
			document.querySelector('.modal-select-item .select-pure__select').style = "";
			getNodeList('input.form-control').forEach( (i) => i.style = "" );
			removeClass('#modal-edit .select-pure__option', 'select-pure__option--selected');

			lock(item.Attachment);

			window.gapmap.editDate.datepicker('setDate', new Date(item.Date).toLocaleDateString('en-GB'));

			target.querySelector('.attachment-title').value = item.Title;
			target.querySelector('.modal-evidence select').value = item.Evidence;
			target.querySelector('.modal-language select').value = item.Language;
			target.querySelector('.modal-region select').value = item.Region;

			target.querySelector('.select-pure__label').innerText = item.Country;
			target.querySelector(`.select-pure__option[data-value="${item.Country}"]`).classList.add('select-pure__option--selected');
			target.querySelector('.select-pure__placeholder').classList.add('select-pure__placeholder--hidden');

			target.querySelector('.modal-author').value = item.Author;
			target.querySelector('.modal-study').value = item.Study;
			target.querySelector('.modal-population').value = item.Population;
			target.querySelector('.modal-estimators').value = item.Estimators;
			target.querySelector('.modal-metrics').value = item.Metrics;
			target.querySelector('.modal-control select').value = item.Control;
			target.querySelector('.modal-intervention select').value = item.Intervention;
			target.querySelector('.modal-outcome select').value = item.Outcome;
			target.querySelector('.ql-editor').innerHTML = item.Description;

			target.classList.remove('vanish');
			button.classList.remove('hidden');
		}
	};
}

function selectOptions(list, placeholder, auto, value) {
	return {
		options: list,
		placeholder: placeholder,
		autocomplete: auto,
		value: value,
		onChange: () => getNodeList('.select-pure__select').forEach( (i) => i.style = "" )
	};
}

// parameters for @chenfengyuan/datepicker instances in settings menu
function datePickerOptions(format, autoHide) {
	return {
		zIndex: 1100,
		format: format,
		autoHide: autoHide
	};
}

// parameters for QuillJS instances in settings menu
function editorOptions(target) {
	return {
		modules: {
			'toolbar': [ 
				[ 'bold', 'italic', 'underline' ], 
				[{ 'color': [] }, { 'background': [] }, { 'script': 'sub'}, { 'script': 'super' }], 
				[{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }], 
				[{ 'align': [] }], [ 'link'] 
			],
			counter: { container: `${target} .counter`, unit: 'character' }
		},
		placeholder: 'Insert a description',
		theme: 'snow'
	};
}