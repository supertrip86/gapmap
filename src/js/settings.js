import $ from "jquery";
import SelectPure from "select-pure";
import Sortable from 'sortablejs';
import datepicker from "@chenfengyuan/datepicker";
import quill from 'quill';
import utilities from "../js/utilities.js";
import { display } from "../js/errorHandler.js";
import { saveResource, deleteResource, deleteAttachment, modifyParameters, receiveData } from "../js/requests.js";
import settingsTemplate from "../hbs/settings.hbs";
import "@chenfengyuan/datepicker/dist/datepicker.css";
import "quill/dist/quill.snow.css";
import "../css/settings.css";

const validateAttachmentCreation = () => {
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

const validateAttachmentDeletion = () => {
    const context = utilities.currentMenu();
    const isEdit = (context.id == "modal-edit");

    if (isEdit) {
        const index = context.querySelector('#edit-resource').dataset.item;
        const selectedResource = gapmap.data.resources.filter((i) => (i.Id == index))[0];
        const hasAttachment = selectedResource.Attachments;

        if (hasAttachment) {
            const attachmentURL = selectedResource.AttachmentFiles.results[0].ServerRelativeUrl;

            return display('deleteAttachment', true, deleteAttachment, attachmentURL);
        }

    }

    return utilities.unLock();
};

const validateResourceCreation = (target, id) => {
    const titleElement = target.querySelector('.attachment-title');
    const studyElement = target.querySelector('.modal-study');
    const selectElement = target.querySelector('.modal-select-item .select-pure__select');
    const input = target.querySelectorAll('input.form-control');
    const editors = target.querySelectorAll('.ql-editor');

    const title = utilities.get.getValue(`#${target.id} .attachment-title`);
    const study = utilities.get.getValue(`#${target.id} .modal-study`);
    const editMode = (target.id == "modal-edit");
    const emptyValue = !gapmap.selectResource.value();
    const findDuplication = !!gapmap.data.resources.filter((i) => (i.label == title)).length;
    const modifiedTitle = !(title == titleElement.dataset.origin);

    if (editMode && emptyValue) {
        rejectRequest(selectElement, 'selectResource', false);
        return false;
    }

    if (!title) {
        rejectRequest(titleElement, 'addFormInvalid', false);
        return false;
    }

    if (!study) {
        rejectRequest(studyElement, 'addFormInvalid', false);
        return false;
    }

    if ((editMode && modifiedTitle && findDuplication) || (!editMode && findDuplication)) {
        rejectRequest(titleElement, 'invalidTitle', false);
        return false;
    }

    for (element of input) {
        if (element.value.length > 250) {
            rejectRequest(element, 'invalidInput', false);
            return false;
        }
    }

    for (element of editors) {
        if (element.innerHTML.length > 62000) {
            rejectRequest(element.parentNode, 'invalidDescription', false);
            return false;
        }
    }

    display('saveResource', true, saveResource, id);

    function rejectRequest(element, message, confirm) {
        display(message, confirm);
        element.style.border = '1px solid red';
    }

};

const validateResourceDeletion = () => {
    const context = (utilities.currentMenu().id == "modal-edit");
    const id = document.getElementById('edit-resource').dataset.item;

    if (context && id) {
        display('deleteResource', true, deleteResource, parseInt(id));
    }
};

const validateParametersModification = (context) => {
    const input = context.querySelectorAll('input.form-control');
    const style = '1px solid red';

    let empty = false;
    let exceeded = false;

    for (element of input) {

        if (!element.value.trim()) {
            empty = true;
            element.style.border = style;
        }

        if (element.value.length > 250) {
            exceeded = true;
            element.style.border = style;
        }

    }

    if (empty) {
        display('addFormInvalid', false);
        return false;
    }

    if (exceeded) {
        display('invalidInput', false);
        return false;
    }

    display('modifyParameters', true, modifyParameters);

}

const addResourceForm = () => {
    const context = utilities.currentMenu();
    const template = require('../hbs/partials/resourceData.hbs');
    const item = new ResourceData(gapmap.data);

    context.querySelector('.intervention-outcome-container').insertAdjacentHTML('beforeend', template(item));

    const incomeOptions = utilities.options.selectOptions(gapmap.data.incomes, "Select an Income Group", true, true);
    const regionOptions = utilities.options.selectOptions(gapmap.data.regions, "Select a Region", true, true);
    const countryOptions = utilities.options.selectOptions(gapmap.data.countries, "Select a Country", true, true);
    const editorOptions = utilities.options.editorOptions();
    const index = context.querySelectorAll('.modal-country').length - 1;

    new SelectPure(context.querySelectorAll('.modal-income')[index], incomeOptions);
    new SelectPure(context.querySelectorAll('.modal-region')[index], regionOptions)
    new SelectPure(context.querySelectorAll('.modal-country')[index], countryOptions);
    new quill(context.querySelectorAll('.editor')[index], editorOptions);
};

const deleteResourceForm = (event) => {
    event.target.closest('.card').remove();
};

const saveChanges = () => {
    const target = utilities.currentMenu();
    const resourceId = document.getElementById('edit-resource').dataset.item;

    if (target.id == 'modal-add') {
        return validateResourceCreation(target);
    }
    if (target.id == 'modal-modify') {
        return validateParametersModification(target);
    }
    if (target.id == 'modal-edit') {
        const resourceList = gapmap.data.storage.resourceList;
        const options = "?$select=Modified,Editor/Title&$expand=Editor";
        const url = `${_spPageContextInfo.webServerRelativeUrl}/_api/web/lists/getbytitle('${resourceList}')/items(${resourceId})${options}`;

        receiveData(url).then( (result) => {
            try {
                const etag = result.d.__metadata.etag.replace(/"/g, '');
                const current = document.getElementById('edit-resource').dataset.etag;

                if (etag != current) {
                    display('resourceModified', false);
                    
                    return false;
                }
                
                return validateResourceCreation(target, resourceId);
                
            } catch (error) {
                throw new TypeError('Resource concurrently deleted by other user');
            }

        });
    }
};

const resetForm = () => {
    const target = document.getElementById('edit-resource');

    utilities.get.getNodeList('select.form-control').forEach( (i) => i.selectedIndex = 0 );
    utilities.get.getNodeList('.form-resource').forEach( (i) => i.value = "" );
    utilities.get.getNodeList('.form-parameter').forEach( (i) => i.value = i.defaultValue );
    utilities.get.getNodeList('.btn-file input').forEach( (i) => utilities.unLock(null, i.closest('.container')) );
    utilities.get.getNodeList('.ql-editor').forEach( (i) => i.innerHTML = "" );

    utilities.get.getNodeList('input.form-control').forEach( (i) => i.removeAttribute('style') );
    utilities.get.getNodeList('.select-pure__select').forEach( (i) => i.removeAttribute('style') );
    utilities.get.getNodeList('.intervention-outcome-container').forEach( (i) => i.innerHTML = "" );

    target.classList.add('vanish');
    target.removeAttribute('data-item');
    target.querySelector('.attachment-title').removeAttribute('data-origin');
    document.getElementById('remove-resource').parentNode.classList.add('invisible', 'hidden');

    gapmap.sortInterventions.sort(gapmap.interventionsOrder);
    gapmap.sortOutcomes.sort(gapmap.outcomesOrder);

    gapmap.selectResource.reset();
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

const loadResource = (value) => {
    const target = document.getElementById('edit-resource');
    const button = document.getElementById('remove-resource').parentNode;
    const element = gapmap.data.resources.filter( (i) => i.Title == value )[0];
    const template = require('../hbs/partials/resourceData.hbs');

    document.querySelector('.modal-select-item .select-pure__select').style = "";
    utilities.get.getNodeList('input.form-control').forEach( (i) => i.style = "" );

    target.dataset.item = element.Id;
    target.dataset.etag = element.__metadata.etag.replace(/"/g, '');

    gapmap.editDate.datepicker('setDate', new Date(element.Date));

    target.querySelector('.attachment-title').value = element.Title;
    target.querySelector('.attachment-title').dataset.origin = element.Title;
    target.querySelector('.modal-evidence select').value = element.Evidence;
    target.querySelector('.modal-language select').value = element.Language;
    target.querySelector('.modal-author').value = element.Author0;
    target.querySelector('.modal-study').value = element.Study;

    if (element.Attachments) {
        const fileURL = element.AttachmentFiles.results[0].ServerRelativeUrl;

        utilities.unLock();
        utilities.lock(element.Title, fileURL);
    } else {
        utilities.unLock();
    }

    if (element.Data.length) {
        const item = new ResourceData(gapmap.data, element.Data);

        target.querySelector('.intervention-outcome-container').innerHTML = template(item);

        element.Data.forEach( (i, j) => {
            const incomeOptions = utilities.options.selectOptions(gapmap.data.incomes, "Select an Income Group", true, true, i.Income);
            const regionOptions = utilities.options.selectOptions(gapmap.data.regions, "Select a Region", true, true, i.Region);
            const countryOptions = utilities.options.selectOptions(gapmap.data.countries, "Select a Country", true, true, i.Country);
            const editorOptions = utilities.options.editorOptions();

            new SelectPure(target.querySelectorAll('.modal-income')[j], incomeOptions);
            new SelectPure(target.querySelectorAll('.modal-region')[j], regionOptions);
            new SelectPure(target.querySelectorAll('.modal-country')[j], countryOptions);
            new quill(target.querySelectorAll('.editor')[j], editorOptions);

            target.querySelectorAll('.editor')[j].querySelector('.ql-editor').innerHTML = i.Description;
            target.querySelectorAll('.modal-impact select')[j].value = i.Impact;
            target.querySelectorAll('.modal-population')[j].value = i.Population;
            target.querySelectorAll('.modal-metrics')[j].value = i.Metrics;
            target.querySelectorAll('.modal-paragraphs')[j].value = i.Paragraphs;
            target.querySelectorAll('.modal-intervention select')[j].value = i.Intervention;
            target.querySelectorAll('.modal-outcome select')[j].value = i.Outcome;
        });
    }

    target.classList.remove('vanish');
    button.classList.remove('hidden');
};

const resourceList = (list, placeholder, auto, value) => {
	return {
		options: list,
		placeholder: placeholder,
		autocomplete: auto,
		value: value,
		onChange: (value) => loadResource(value)
	};
};

const addSettingsListeners = () => {
    $('#gapmap-dialog').on('change', '.modal-datepicker', function() { $(this).removeAttr('style') }); // change event in @chenfengyuan/datepicker triggered by jQuery
    $('#gapmap-dialog').on('hidden.bs.modal', resetForm); // change event in bootstrap triggered by jQuery

    utilities.on('#gapmap-dialog', 'input', '.form-control', utilities.clearStyle);
    utilities.on('#gapmap-dialog', 'paste', '.modal-datepicker', utilities.preventPaste);
    utilities.on('#gapmap-dialog', 'keypress', '.modal-datepicker', utilities.preventCopy);
    utilities.on('#gapmap-dialog', 'change', '.modal-intervention select', utilities.changeColor);
    utilities.on('#gapmap-dialog', 'change', '.attachment-fileinput', validateAttachmentCreation);
    utilities.on('#gapmap-dialog', 'click', '.remove-document', validateAttachmentDeletion);
    utilities.on('#gapmap-dialog', 'click', '.add-resource-button', addResourceForm);
    utilities.on('#gapmap-dialog', 'click', '.delete-resource-button', deleteResourceForm);
    utilities.on('#gapmap-dialog', 'click', '.modal-tab', switchForm);
    utilities.on('#gapmap-dialog', 'click', '#remove-resource', validateResourceDeletion);
    utilities.on('#gapmap-dialog', 'click', '#save-changes', saveChanges);
};

const settingsOptions = (data) => {
    const datePickerOptions = utilities.options.datePickerOptions("mm / yyyy", true);
    const sortableOptions = utilities.options.sortableOptions(150, 'vertical', '.modal-drag');
    const resourceListOptions = resourceList(data.resources, "Select a Resource", true);

    const addDate = $('#modal-add .modal-datepicker').datepicker(datePickerOptions); // jQuery needed as @chenfengyuan/datepicker dependency
    const editDate = $('#modal-edit .modal-datepicker').datepicker(datePickerOptions); // jQuery needed as @chenfengyuan/datepicker dependency

    const selectResource = new SelectPure(document.querySelector('.modal-select-item'), resourceListOptions);
    const sortInterventions = new Sortable(document.querySelector('.card-interventions'), sortableOptions);
    const sortOutcomes = new Sortable(document.querySelector('.card-outcomes'), sortableOptions);
    const interventionsOrder = sortInterventions.toArray();
    const outcomesOrder = sortOutcomes.toArray();

    return {
        data: data,
        selectResource: selectResource,
        addDate: addDate,
        editDate: editDate,
        selectResource: selectResource,
        sortInterventions: sortInterventions,
        sortOutcomes: sortOutcomes,
        interventionsOrder: interventionsOrder,
        outcomesOrder: outcomesOrder
    };
};

class ResourceData {
    constructor(data, resources) {
        this.interventions = data.interventions;
        this.outcomes = data.outcomes;
        this.incomes = data.incomes;
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

export { settingsTemplate, addSettingsListeners, settingsOptions }