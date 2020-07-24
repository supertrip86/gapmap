const $ = require('jquery');
const selectPure = require('select-pure');
const datepicker = require('@chenfengyuan/datepicker/dist/datepicker.js');
const datepickerCss = require('@chenfengyuan/datepicker/dist/datepicker.css');
const error = require("../js/errorHandler.js");
const utilities = require("../js/utilities.js");
const counter = require("../js/textCounter.js");
const requests = require("../js/requests.js");
const css = require("../css/settings.css");
const template = require("../hbs/settings.hbs");

const validateAttachment = () => {
    const context = utilities.currentMenu();
    const source = context.querySelector('.attachment-fileinput');

    if (source.files.length) {
        const filename = source.files[0].name;
        const size = source.files[0].size;

        if (utilities.check.isFileInvalid(filename)) {
            rejectUpload('invalidFile', false);
            return false;
        }
        if (utilities.check.isFilenameInvalid(filename)) {
            rejectUpload('invalidFilename', false);
            return false;
        }
        if (utilities.check.isFilesizeExceeded(size)) {
            rejectUpload('invalidFileSize', false);
            return false;
        }

        utilities.lock(filename);

        function rejectUpload(err, confirm) {
            source.value = "";
            utilities.unLock();
            error.display(err, confirm);
        }
    } else {
        utilities.unLock();
    }
};

const validateNewResource = () => {
    const date = document.querySelector('#modal-add .modal-datepicker');
    const country = document.querySelector('#modal-add .select-pure__select');
    const file = document.querySelector('#modal-add .btn-file');
    const input = document.querySelectorAll('#modal-add input.form-control');
    const style = '1px solid red';

    let proceed = true;

    !utilities.get.getDate('#modal-add .modal-datepicker') && rejectRequest(date);
    !file.querySelector('input').files.length && rejectRequest(file);
    !country.querySelector('.select-pure__label').innerText && rejectRequest(country);

    for (element of input) {
        !element.value.trim() && rejectRequest(element);
    }

    proceed ? requests.addResource() : error.display('addFormInvalid', false);

    function rejectRequest(element) {
        proceed = false;
        element.style.border = style;
    }
};

const validateEditResource = () => {
    console.log('hello');
};

const validateModifyParameters = () => {
    console.log('hello');
}

const resetForm = () => {
    utilities.get.getNodeList('input.form-control').forEach( (i) => i.value = "" );
    utilities.get.getNodeList('.form-select select').forEach( (i) => i.selectedIndex = 0 );
    utilities.get.getNodeList('.btn-file input').forEach( (i) => utilities.unLock(null, i.closest('.container')) );
    utilities.get.getNodeList('.ql-editor').forEach( (i) => i.innerHTML = "" );
    
    utilities.get.getNodeList('input.form-control').forEach( (i) => i.removeAttribute('style') );
    utilities.get.getNodeList('.btn-file').forEach( (i) => i.removeAttribute('style') );
    utilities.get.getNodeList('.select-pure__select').forEach( (i) => i.removeAttribute('style') );

    document.getElementById('edit-resource').classList.add('vanish');

    window.gapmap.addCountry.reset();
    window.gapmap.editCountry.reset();
    window.gapmap.selectResource.reset();
};

const switchForm = () => {
    utilities.get.getNodeList('.modal-tab').forEach( (i) => i.classList.remove('modal-active-tab') );
    utilities.get.getNodeList('#gapmap-dialog .container').forEach( (i) => i.classList.add('vanish') );

    event.target.classList.add('modal-active-tab');
    utilities.currentMenu().classList.remove('vanish');
};

const addListeners = () => {
    $('#gapmap-dialog').on('change', '.modal-datepicker', function() { $(this).removeAttr('style') }); // change event in @chenfengyuan/datepicker triggered by jQuery
    $('#gapmap-dialog').on('hidden.bs.modal', resetForm); // change event in bootstrap triggered by jQuery

    utilities.on('#gapmap-dialog', 'input', '.form-control', utilities.clearStyle);
    utilities.on('#gapmap-dialog', 'click', '.remove-document', utilities.unLock);
    utilities.on('#gapmap-dialog', 'paste', '.modal-datepicker', utilities.preventPaste);
    utilities.on('#gapmap-dialog', 'keypress', '.modal-datepicker', utilities.preventCopy);
    utilities.on('#gapmap-dialog', 'click', '#save-changes', saveChanges);
    utilities.on('#gapmap-dialog', 'change', '.attachment-fileinput', validateAttachment);
    utilities.on('#gapmap-dialog', 'click', '.modal-tab', switchForm);
};

const saveChanges = () => {
    const target = utilities.currentMenu().id;

    switch (target) {
        case 'modal-add':
            return validateNewResource();
        case 'modal-edit':
            return validateEditResource();
        case 'modal-modify':
            return validateModifyParameters();
    }
};

requests.receiveData('/api/data.json').then((data) => {
    const dialog = document.getElementById("gapmap-dialog");

    dialog.innerHTML = template(data);

    const selectOptions = utilities.options.selectOptions(data.countries, "Select a Country", true);
    const resourceListOptions = utilities.options.resourceListOptions(data.items, "Select a Resource", true);
    const datePickerOptions = utilities.options.datePickerOptions("dd/mm/yyyy", true);
    const editorOptions = utilities.options.editorOptions('#modal-add');

    const addCountry = new selectPure.default(document.querySelector('#modal-add .modal-country'), selectOptions);
    const addEditor = new counter.quill('#modal-add .editor', editorOptions);
    const addDate = $('#modal-add .modal-datepicker').datepicker(datePickerOptions); // jQuery needed as @chenfengyuan/datepicker dependency

    const selectResource = new selectPure.default(document.querySelector('.modal-select-item'), resourceListOptions);
    const editCountry = new selectPure.default(document.querySelector('#modal-edit .modal-country'), selectOptions);
    const editEditor = new counter.quill('#modal-edit .editor', editorOptions);
    const editDate = $('#modal-edit .modal-datepicker').datepicker(datePickerOptions); // jQuery needed as @chenfengyuan/datepicker dependency

    class GapMap {
        constructor() {
            this.data = data;
            this.selectResource = selectResource;
            this.addCountry = addCountry;
            this.editCountry = editCountry;
            this.editDate;
        }
    }

    window.gapmap = new GapMap();

    addListeners();
});