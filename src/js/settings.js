import $ from "jquery";
import SelectPure from "select-pure";
import Sortable from 'sortablejs';
import datepicker from "@chenfengyuan/datepicker";
import quill from 'quill';
import { display } from "../js/errorHandler.js";
import { saveResource, deleteResource, modifyParameters } from "../js/requests.js";
import utilities from "../js/utilities.js";
import settingsTemplate from "../hbs/settings.hbs";
import "@chenfengyuan/datepicker/dist/datepicker.css";
import "quill/dist/quill.snow.css";
import "../css/settings.css";

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
            display(err, confirm);
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
    !utilities.get.getDate(`#${context.id} .modal-datepicker`) && rejectRequest(date);

    for (element of input) {
        !element.value.trim() && rejectRequest(element);
    }

    if (country) {
        !country.querySelector('.select-pure__label').innerText && rejectRequest(country);
    }

    if (!proceed) {
        display('addFormInvalid', false);
        return false;
    }

    saveResource(id);

    function rejectRequest(element) {
        proceed = false;
        element.style.border = style;
    }
};

const validateModifyParameters = (context) => {
    const input = context.querySelectorAll('input.form-control');
    const style = '1px solid red';

    let proceed = true;

    for (element of input) {
        !element.value.trim() && rejectRequest(element);
    }

    if (!proceed) {
        display('addFormInvalid', false);
        return false;
    }

    modifyParameters();

    function rejectRequest(element) {
        proceed = false;
        element.style.border = style;
    }
}

const validateDeletion = () => {
    const context = (utilities.currentMenu().id == "modal-edit");
    const id = document.getElementById('edit-resource').dataset.item;

    if (context && id) {
        deleteResource( parseInt(id) );
    }
};

const resourceList = (list, placeholder, auto, value) => {
	return {
		options: list,
		placeholder: placeholder,
		autocomplete: auto,
		value: value,
		onChange: (value) => {
			const target = document.getElementById('edit-resource');
			const button = document.getElementById('remove-resource').parentNode;
			const element = window.gapmap.data.resources.filter( (i) => i.Title == value )[0];
			const template = require('../hbs/partials/resourceData.hbs');

			document.getElementById('edit-resource').dataset.item = element.Id;
			document.querySelector('.modal-select-item .select-pure__select').style = "";
			utilities.get.getNodeList('input.form-control').forEach( (i) => i.style = "" );

			utilities.lock(element.Attachment);

			window.gapmap.editDate.datepicker('setDate', new Date(element.Date).toLocaleDateString('en-GB'));

			target.querySelector('.attachment-title').value = element.Title;
			target.querySelector('.modal-evidence select').value = element.Evidence;
			target.querySelector('.modal-language select').value = element.Language;
			target.querySelector('.modal-author').value = element.Author;
			target.querySelector('.modal-study').value = element.Study;
			target.querySelector('.modal-estimators').value = element.Estimators;
			target.querySelector('.modal-control select').value = element.Control;

			if (element.Data.length) {
                const item = new ResourceData(window.gapmap.data, element.Data);

				target.querySelector('.intervention-outcome-container').innerHTML = template(item);

                element.Data.forEach( (i, j) => {
                    const selectOptions = utilities.options.selectOptions(window.gapmap.data.countries, "Select a Country", true, true, i.Country);
                    const editorOptions = utilities.options.editorOptions();

                    new SelectPure(target.querySelectorAll('.modal-country')[j], selectOptions);
                    new quill(target.querySelectorAll('.editor')[j], editorOptions);

                    target.querySelectorAll('.editor')[j].querySelector('.ql-editor').innerHTML = i.Description;
                    target.querySelectorAll('.modal-region select')[j].value = i.Region;
                    target.querySelectorAll('.modal-population')[j].value = i.Population;
                    target.querySelectorAll('.modal-metrics')[j].value = i.Metrics;
                    target.querySelectorAll('.modal-intervention select')[j].value = i.Intervention;
                    target.querySelectorAll('.modal-outcome select')[j].value = i.Outcome;
                });
            }

			target.classList.remove('vanish');
			button.classList.remove('hidden');
		}
	};
};

const addResourceElement = () => {
    const context = utilities.currentMenu();
    const template = require('../hbs/partials/resourceData.hbs');

    const item = new ResourceData(window.gapmap.data);

    context.querySelector('.intervention-outcome-container').insertAdjacentHTML('beforeend', template(item));

    const selectOptions = utilities.options.selectOptions(window.gapmap.data.countries, "Select a Country", true, true);
    const editorOptions = utilities.options.editorOptions();
    const index = context.querySelectorAll('.modal-country').length - 1;

    new SelectPure(context.querySelectorAll('.modal-country')[index], selectOptions);
    new quill(context.querySelectorAll('.editor')[index], editorOptions);
};

const deleteResourceElement = (event) => {
    event.target.closest('.card').remove();
};

const saveChanges = () => {
    const target = utilities.currentMenu();
    const resourceId = document.getElementById('edit-resource').dataset.item;

    if (target.id == 'modal-modify') {
        return validateModifyParameters(target);
    }
    if (target.id == 'modal-edit') {
        return validateResource(target, resourceId);
    }

    return validateResource(target);
};

const resetForm = () => {
    utilities.get.getNodeList('select.form-control').forEach( (i) => i.selectedIndex = 0 );
    utilities.get.getNodeList('.form-resource').forEach( (i) => i.value = "" );
    utilities.get.getNodeList('.form-parameter').forEach( (i) => i.value = i.defaultValue );
    utilities.get.getNodeList('.btn-file input').forEach( (i) => utilities.unLock(null, i.closest('.container')) );
    utilities.get.getNodeList('.ql-editor').forEach( (i) => i.innerHTML = "" );

    utilities.get.getNodeList('input.form-control').forEach( (i) => i.removeAttribute('style') );
    utilities.get.getNodeList('.btn-file').forEach( (i) => i.removeAttribute('style') );
    utilities.get.getNodeList('.select-pure__select').forEach( (i) => i.removeAttribute('style') );
    utilities.get.getNodeList('.intervention-outcome-container').forEach( (i) => i.innerHTML = "" );

    document.getElementById('edit-resource').classList.add('vanish');
    document.getElementById('edit-resource').removeAttribute('data-item');
    document.getElementById('remove-resource').parentNode.classList.add('invisible', 'hidden');

    window.gapmap.sortInterventions.sort(window.gapmap.interventionsOrder);
    window.gapmap.sortOutcomes.sort(window.gapmap.outcomesOrder);

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
    utilities.on('#gapmap-dialog', 'change', '.modal-intervention select', utilities.changeColor);
    utilities.on('#gapmap-dialog', 'change', '.attachment-fileinput', validateAttachment);
    utilities.on('#gapmap-dialog', 'click', '.add-resource-button', addResourceElement);
    utilities.on('#gapmap-dialog', 'click', '.delete-resource-button', deleteResourceElement);
    utilities.on('#gapmap-dialog', 'click', '.modal-tab', switchForm);
    utilities.on('#gapmap-dialog', 'click', '#remove-resource', validateDeletion);
    utilities.on('#gapmap-dialog', 'click', '#save-changes', saveChanges);
};

const addSettingsMenu = (data, settingsId) => {
    const datePickerOptions = utilities.options.datePickerOptions("mm / yyyy", true);
    const sortableOptions = utilities.options.sortableOptions(150, 'vertical', '.modal-drag');
    const resourceListOptions = resourceList(data.resources, "Select a Resource", true);

    const addDate = $('#modal-add .modal-datepicker').datepicker(datePickerOptions); // jQuery needed as @chenfengyuan/datepicker dependency
    const editDate = $('#modal-edit .modal-datepicker').datepicker(datePickerOptions); // jQuery needed as @chenfengyuan/datepicker dependency

    const selectResource = new SelectPure(document.querySelector('.modal-select-item'), resourceListOptions);

    const sortInterventions = new Sortable(document.querySelector('.card-interventions'), sortableOptions);
    const interventionsOrder = sortInterventions.toArray();
    const sortOutcomes = new Sortable(document.querySelector('.card-outcomes'), sortableOptions);
    const outcomesOrder = sortOutcomes.toArray();

    class GapMap {
        constructor() {
            this.data = data;
            this.settingsId = settingsId; // SharePoint List Item Id
            this.selectResource = selectResource;
            this.addDate = addDate;
            this.editDate = editDate;
            this.sortInterventions = sortInterventions;
            this.sortOutcomes = sortOutcomes;
            this.interventionsOrder = interventionsOrder;
            this.outcomesOrder = outcomesOrder;
        }
    }

    window.gapmap = new GapMap();
};

class ResourceData {
    constructor(data, resources) {
        this.interventions = data.interventions;
        this.outcomes = data.outcomes;
        this.countries = data.countries;
        this.regions = data.regions;
        this.resources = this.initResources(resources);
    }

    initResources(resources) {
        if (resources) {
            return resources;
        }

        return [{ Country: [], Description: "", Intervention: "1", Metrics: "", Outcome: "1", Population: "", Region: "" }];
    }
}

export { settingsTemplate, addSettingsMenu, addListeners }