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

const validateResource = (context, id) => {
    const date = context.querySelector('.modal-datepicker');
    const country = context.querySelector('.select-pure__select');
    const file = context.querySelector('.btn-file');
    const input = context.querySelectorAll('input.form-control');
    const style = '1px solid red';

    let proceed = true;

    !context.querySelector('.attachment-filetitle').value && rejectRequest(file);
    !country.querySelector('.select-pure__label').innerText && rejectRequest(country);
    !utilities.get.getDate(`#${context.id} .modal-datepicker`) && rejectRequest(date);

    for (element of input) {
        !element.value.trim() && rejectRequest(element);
    }

    if (!proceed) {
        error.display('addFormInvalid', false);
        return false;
    }

    id ? requests.editResource() : requests.addResource();

    function rejectRequest(element) {
        proceed = false;
        element.style.border = style;
    }
};

const validateModifyParameters = () => {
    console.log('hello');
}

const saveChanges = () => {
    const target = utilities.currentMenu();
    let id;

    if (target.id == 'modal-modify') {
        return validateModifyParameters();
    }

    // if (target.id == 'modal-edit') {
    //     id = ... // if 'modal-edit' get id
    // }

    return validateResource(target, id);
};

const resetForm = () => {
    utilities.get.getNodeList('input.form-control').forEach( (i) => i.value = "" );
    utilities.get.getNodeList('select.form-control').forEach( (i) => i.selectedIndex = 0 );
    utilities.get.getNodeList('.btn-file input').forEach( (i) => utilities.unLock(null, i.closest('.container')) );
    utilities.get.getNodeList('.ql-editor').forEach( (i) => i.innerHTML = "" );
    
    utilities.get.getNodeList('input.form-control').forEach( (i) => i.removeAttribute('style') );
    utilities.get.getNodeList('.btn-file').forEach( (i) => i.removeAttribute('style') );
    utilities.get.getNodeList('.select-pure__select').forEach( (i) => i.removeAttribute('style') );

    document.getElementById('edit-resource').classList.add('vanish');
    document.getElementById('remove-resource').parentNode.classList.add('invisible', 'hidden');

    window.gapmap.addCountry.reset();
    window.gapmap.editCountry.reset();
    window.gapmap.selectResource.reset();
};

const switchForm = () => {
    utilities.get.getNodeList('.modal-tab').forEach( (i) => i.classList.remove('modal-active-tab') );
    utilities.get.getNodeList('#gapmap-dialog .container').forEach( (i) => i.classList.add('vanish') );

    event.target.classList.add('modal-active-tab');
    utilities.currentMenu().classList.remove('vanish');

    if (utilities.currentMenu().id == 'modal-edit') {
        document.getElementById('remove-resource').parentNode.classList.remove('invisible');
    } else {
        document.getElementById('remove-resource').parentNode.classList.add('invisible');
    }
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

requests.receiveData('/api/data.json').then((data) => {
    const dialog = document.getElementById("gapmap-dialog");

    dialog.innerHTML = template(data);

    const selectOptions = utilities.options.selectOptions(data.countries, "Select a Country", true);
    const resourceListOptions = utilities.options.resourceListOptions(data.resources, "Select a Resource", true);
    const datePickerOptions = utilities.options.datePickerOptions("dd/mm/yyyy", true);
    
    const addDate = $('#modal-add .modal-datepicker').datepicker(datePickerOptions); // jQuery needed as @chenfengyuan/datepicker dependency
    const editDate = $('#modal-edit .modal-datepicker').datepicker(datePickerOptions); // jQuery needed as @chenfengyuan/datepicker dependency
    
    const addCountry = new selectPure.default(document.querySelector('#modal-add .modal-country'), selectOptions);
    const editCountry = new selectPure.default(document.querySelector('#modal-edit .modal-country'), selectOptions);
    const selectResource = new selectPure.default(document.querySelector('.modal-select-item'), resourceListOptions);
    
    new counter.quill('#modal-add .editor', utilities.options.editorOptions('#modal-add'));
    new counter.quill('#modal-edit .editor', utilities.options.editorOptions('#modal-edit'));

    class GapMap {
        constructor() {
            this.data = data;
            this.selectResource = selectResource;
            this.addDate = addDate;
            this.editDate = editDate;
            this.addCountry = addCountry;
            this.editCountry = editCountry;
        }
    }

    window.gapmap = new GapMap();

    addListeners();
});