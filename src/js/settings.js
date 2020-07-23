const $ = require('jquery');
const select = require('select-pure');
const datepicker = require('@chenfengyuan/datepicker/dist/datepicker.js');
const datepickerCss = require('@chenfengyuan/datepicker/dist/datepicker.css');
const error = require("../js/errorHandler.js");
const utilities = require("../js/utilities.js");
const counter = require("../js/textCounter.js");
const requests = require("../js/requests.js");
const css = require("../css/settings.css");
const template = require("../hbs/settings.hbs");

// validate attachment file selected in dialog menu
const validateAttachment = () => {
    const source = document.getElementById('attachment-fileinput');

    if (source.files.length) {
        const filename = source.files[0].name;
        const size = source.files[0].size;

        if (utilities.check.isFileInvalid(filename)) {
            rejectUpload('invalidFile', false);
            return;
        }
        if (utilities.check.isFilenameInvalid(filename)) {
            rejectUpload('invalidFilename', false);
            return;
        }
        if (utilities.check.isFilesizeExceeded(size)) {
            rejectUpload('invalidFileSize', false);
            return;
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
    const form = document.getElementById('modal-add');
    // const file = 
    const input = form.querySelectorAll('input.form-control');
    const style = '1px solid red';

    let proceed = true;

    for (element of input) {
        !element.value.trim() && rejectRequest(element);
    }

    proceed && requests.addResource();

    function rejectRequest(element) {
        proceed = false;
        element.style.border = style;
    }
};

// save data from the active menu into a SharePoint List item
const saveChanges = () => {
    const target = utilities.currentMenu().id;

    switch (target) {
        case 'modal-add':
            return validateNewResource();
        case 'modal-edit':
            return 'Edit resource';
        case 'modal-modify':
            return 'Modify parameters';
    }
};

requests.receiveData('/api/data.json').then((data) => {
    const selectOptions = utilities.options.selectOptions(data.countries, "Select a Country", true);
    const datePickerOptions = utilities.options.createDatePickerOptions("dd/mm/yyyy", true);
    const editorOptions = utilities.options.createEditorOptions();
    const dialog = document.getElementById("gapmap-dialog");

    dialog.innerHTML = template(data);

    new select.default(document.getElementById('modal-country'), selectOptions);
    new counter.quill('#editor', editorOptions);

    $('#modal-datepicker').datepicker(datePickerOptions); // jQuery needed as @chenfengyuan/datepicker dependency
});

utilities.on('#gapmap-dialog', 'click', '.remove-document', utilities.unLock);
utilities.on('#gapmap-dialog', 'click', '#add-resource', saveChanges);
utilities.on('#gapmap-dialog', 'change', '#attachment-fileinput', validateAttachment);