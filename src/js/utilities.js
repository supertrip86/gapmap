const $ = require("jquery");
const jbox = require("jbox");
const jboxCss = require("jbox/dist/jBox.all.css");
const gapmapView = require("../hbs/gapmap.hbs");
const tooltipTemplate = require("../hbs/partials/tooltip.hbs");

module.exports = {
	on: on,
	updateView: updateView,
	removeClass: removeClass,
	currentMenu: currentMenu,
	startLoader: startLoader,
	lock: lock,
	unLock: unLock,
	changeColor: changeColor,
	clearStyle: clearStyle,
	preventPaste: preventPaste,
	preventCopy: preventCopy,
	get: {
		getValue: getValue,
		getText: getText,
		getHTML: getHTML,
		getDate: getDate,
		getOptions: getOptions,
		getNodeList: getNodeList
  	},
  	check: {
		isFileInvalid: isFileInvalid,
		isFilenameInvalid: isFilenameInvalid,
		isFilesizeExceeded: isFilesizeExceeded,
		isEditMode: isEditMode,
		isItemLoaded: isItemLoaded
  	},
  	options: {
		selectOptions: selectOptions,
		sortableOptions: sortableOptions,
		datePickerOptions: datePickerOptions,
		tooltipOptions: tooltipOptions,
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

function updateView() {
	let tooltips = {};

	if (gapmap.tooltips) {
		gapmap.removeTooltips();
	}

	gapmap.initMatrix();

	document.getElementById("gapmap-content").innerHTML = gapmapView(gapmap.data);

	getNodeList('.gapmap-dot').forEach( (i) => {
		const id = i.id;
		const style = i.className.replace('gapmap-dot ', '');

		tooltips[id] = new jbox('Tooltip', tooltipOptions(id, style));
	});

	gapmap.tooltips = tooltips;
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
			return document.getElementById('modal-project-add');
		case 4:
			return document.getElementById('modal-project-edit');
        case 5:
            return document.getElementById('modal-modify');
    }
}

function startLoader() {
	const body = document.getElementsByTagName('body')[0];
	const dialog = document.getElementById('settingsMenu');
	const settingsIcon = document.querySelector('.settings-link');
	const spinner = '<div class="spinner"></div>';

	dialog.setAttribute('style', 'display: none;');
	settingsIcon.setAttribute('style', 'display: none;');
	body.setAttribute('style', 'user-select: none; overflow: hidden;')
	body.insertAdjacentHTML('beforeend', spinner);
}

// lock attached file
function lock(title, url) {
    const context = currentMenu();
	const attachmentContainer = context.querySelector('.attachment-filename');
	const attachment = attachmentContainer.querySelector('.attachment-filetitle');
	const file = context.querySelector('.btn-file');
	const icon = '<span class="remove-document"></span>';

	attachmentContainer.insertAdjacentHTML('beforeend', icon);
	attachment.innerText = title;

	url && attachment.setAttribute('href', url);

	file.querySelector('input').setAttribute('disabled', 'disabled');
	file.style = "";
}

// unlock attached file
function unLock(event, menu) {
    const context = menu ? menu : currentMenu();
    const target = context.querySelectorAll('.remove-document');

    if (target.length) {
		const icon = target[0];
		const file = context.querySelector('.attachment-fileinput');
		const filename = context.querySelector('.attachment-filetitle');

		file.removeAttribute('disabled');
		file.value = "";
		filename.innerText = "";
		filename.removeAttribute('href');
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

function getNodeList(value, context) {
	const target = context ? context : document;

	return Array.from(target.querySelectorAll(value));
}

// when inserting missing data in Settings Menu, this function removes red highlighting
function clearStyle(event) {
	event.target.style = "";
}

function changeColor(event) {
	const index = parseInt(event.target.value) - 1;
	const color = gapmap.data.interventions[index].Color;
	
	event.target.closest('.card').setAttribute('style', `background-color: ${color}`);
}

// get trimmed value from target DOM input
function getValue(value, context) {
	const target = context ? context : document;

	try {
		return target.querySelectorAll(value)[0].value.trim();
	} catch (error) {
		return null;
	}
}

// get innerText from target DOM element
function getText(value, context) {
	const target = context ? context : document;

	try {
		return target.querySelectorAll(value)[0].innerText;
	} catch (error) {
		return null;
	}
}

// get HTML content from target DOM element
function getHTML(value, context) {
	const target = context ? context : document;

	try {
		return target.querySelectorAll(value)[0].innerHTML;
	} catch (error) {
		return null;
	}
}

// get date from datepicker and convert it to ISO 8601, SharePoint compatible
function getDate(value, context) {
	const target = context ? context : document;
	const result = target.querySelectorAll(value)[0].value.trim();
	const dateParts = result.split("/").map((i) => parseInt(i));

	try {
		return new Date(dateParts[1], dateParts[0] -1, 15).toISOString();
	} catch (error) {
		return null;
	}
}

function getOptions(value, context) {
	try {
		return getNodeList(`${value} .select-pure__selected-label`, context).map( (i) => i.innerText ).join('; ');
	} catch (error) {
		return null;
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

function isEditMode() {
	const context = currentMenu();
	const isResourcedEdit = (context.id == 'modal-edit');
	const isProjectEdit = (context.id == 'modal-project-edit');

	return isResourcedEdit || isProjectEdit;
}

function isItemLoaded() {
	const context = currentMenu();
	const isItemLoaded = context.querySelector('.item-container').dataset.item;

	return isItemLoaded;
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

function selectOptions(list, placeholder, auto, multiple, value) {
	return {
		options: list,
		placeholder: placeholder,
		autocomplete: auto,
		multiple: multiple,
		value: value,
		icon: "remove-country",
		onChange: () => getNodeList('.select-pure__select').forEach( (i) => i.style = "" )
	};
}

function tooltipOptions(id, style) {
    const view = gapmap.data.view;
    const coordinates = id.replace('dot-', '').split('-');
    const position = `${coordinates[0]}-${coordinates[1]}`;
	const type = parseInt(coordinates[2]);
	const externals = gapmap.matrix[view][position][type].filter( (i) => i.Evidence == "External");
	const internals = gapmap.matrix[view][position][type].filter( (i) => i.Evidence == "Internal");
    const length = gapmap.matrix[view][position][type].length;

    let title;

    switch (true) {
        case type == 0 && view == 0:
            title = "Systematic Reviews";
            break;
    
        case type == 1 && view == 0:
            title = "Impact Evaluations";
            break;

        case type == 2 && view == 0:
            title = "Other";
            break;

        case type == 0 && view == 1:
            title = "Positive";
            break;
    
        case type == 1 && view == 1:
            title = "Mixed";
            break;

        case type == 2 && view == 1:
            title = "No Impact";
            break;

	}

	return {
		theme: style,
		attach: `#${id}`,
		content: tooltipTemplate( {length: length, title: title, internals: internals, externals: externals} ),
		closeOnMouseleave: true,
		maxWidth: 600,
		minWidth: 200,
		maxHeight: 400,
		minHeight: 100
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
function editorOptions() {
	return {
		modules: {
			'toolbar': [ 
				[ 'bold', 'italic', 'underline' ], 
				[{ 'color': [] }, { 'background': [] }, { 'script': 'sub'}, { 'script': 'super' }], 
				[{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }], 
				[{ 'align': [] }], [ 'link'] 
			]
		},
		placeholder: 'Insert a description',
		theme: 'snow'
	};
}