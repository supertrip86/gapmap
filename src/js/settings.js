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

// save data from the active menu into a SharePoint List item
const saveChanges = () => {
    const target = document.getElementsByClassName("modal-active-tab")[0];
    const index = parseInt(target.dataset.tab);

    switch (index) {
        case 1:
            return requests.addResource();
        case 2:
            return 'Edit resource';
        case 3:
            return 'Modify parameters';
    }
};

// validate attachment file selected in dialog menu
const validateAttachment = () => {
    const source = document.getElementById('attachment-fileinput');
    const target = document.getElementById('attachment-filetitle');

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

        target.value = filename;
        // TODO: lock input

        function rejectUpload(err, confirm) {
            source.value = "";
            target.value = "";
            error.display(err, confirm);
        }
    } else {
        target.value = "";
        // TODO: unlock input
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
    
    utilities.on('#gapmap-dialog', 'click', '#add-resource', saveChanges);
    utilities.on('#gapmap-dialog', 'change', '#attachment-fileinput', validateAttachment);

});

