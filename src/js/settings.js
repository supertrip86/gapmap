const $ = require('jquery');
const select = require('select-pure');
const datepicker = require('@chenfengyuan/datepicker/dist/datepicker.js');
const utilities = require("../js/utilities.js");
const requests = require("../js/requests.js");
const template = require("../hbs/settings.hbs");
const datepickerCss = require('@chenfengyuan/datepicker/dist/datepicker.css');
const css = require("../css/settings.css");

const createSelectOptions = (list, placeholder, auto, value) => {
    return {
        options: list,
        placeholder: placeholder,
        autocomplete: auto,
        value: value
    };
};

const createDatePickerOptions = (format, autoHide) => {
    return {
        zIndex: 1100,
        format: format,
        autoHide: autoHide
    };
};

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

requests.receiveData('/data.json').then((data) => {
    const countries = data.countries;
    const placeholder = "Select a Country";
    const auto = true;
    const selectOptions = createSelectOptions(countries, placeholder, auto);
    const datePickerOptions = createDatePickerOptions("dd/mm/yyyy", true);
    const dialog = document.getElementById("gapmap-dialog");

    dialog.innerHTML = template(data);

    new select.default(document.getElementById('modal-country'), selectOptions);
    
    /* jQuery needed as a dependency for @chenfengyuan/datepicker */
    $('#modal-datepicker').datepicker(datePickerOptions);
    
    utilities.on('#gapmap-dialog', 'click', '#add-resource', saveChanges);
});