module.exports = {
	on: on,
	currentMenu: currentMenu,
	lock: lock,
	unLock: unLock,
	get: {
		getValue: getValue,
		getText: getText,
		getHTML: getHTML,
		getDate: getDate,
  	},
  	check: {
		isFileInvalid: isFileInvalid,
		isFilenameInvalid: isFilenameInvalid,
		isFilesizeExceeded: isFilesizeExceeded,
  	},
  	options: {
		selectOptions: selectOptions,
		createDatePickerOptions: createDatePickerOptions,
		createEditorOptions: createEditorOptions
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
    const target = context.querySelectorAll('.attachment-filename')[0];
    const icon = '<span class="remove-document"></span>';

    target.querySelector('input').value = filename;
    target.insertAdjacentHTML('beforeend', icon);
}

// unlock attached file
function unLock() {
    const context = currentMenu();
    const target = context.querySelectorAll('.remove-document');

    if (target.length) {
		const icon = target[0];
		const file = document.getElementById('attachment-fileinput');
		const filename = document.getElementById('attachment-filetitle');

		file.value = ""
		filename.value = "";
		icon.remove();
    }
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

	return new Date(value).toISOString();
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

// parameters for SelectPure instance in settings menu
function selectOptions(list, placeholder, auto, value) {
	return {
		options: list,
		placeholder: placeholder,
		autocomplete: auto,
		value: value
	};
}

// parameters for @chenfengyuan/datepicker instance in settings menu
function createDatePickerOptions(format, autoHide) {
	return {
		zIndex: 1100,
		format: format,
		autoHide: autoHide
	};
}

// parameters for QuillJS instance in settings menu
function createEditorOptions() {
	return {
		modules: {
			'toolbar': [ 
				[ 'bold', 'italic', 'underline' ], 
				[{ 'color': [] }, { 'background': [] }, { 'script': 'sub'}, { 'script': 'super' }], 
				[{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }], 
				[{ 'align': [] }], [ 'link'] 
			],
			counter: { container: '#counter', unit: 'character' }
		},
		placeholder: 'Insert a description',
		theme: 'snow'
	};
}