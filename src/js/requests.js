import utilities from "../js/utilities.js";

class SharepointListItem {
    constructor() {
        this.Title = utilities.get.getValue(`.attachment-title`, this.getContext());
        this.label = utilities.get.getValue(`.attachment-title`, this.getContext());
        this.value = utilities.get.getValue(`.attachment-title`, this.getContext());
        this.Evidence = utilities.get.getValue(`.modal-evidence select option:checked`, this.getContext());
        this.Language = utilities.get.getValue(`.modal-language option:checked`, this.getContext());
        this.Date = utilities.get.getDate(`.modal-datepicker`, this.getContext());
        this.Author = utilities.get.getValue(`.modal-author`, this.getContext());
        this.Study = utilities.get.getValue(`.modal-study`, this.getContext());
        this.Estimators = utilities.get.getValue(`.modal-estimators`, this.getContext());
        this.Control = utilities.get.getValue(`.modal-control select option:checked`, this.getContext());
        this.Data = this.getData();
        this.__metadata = { type: this.getMetadataType() };
    }

    getContext() {
        return utilities.currentMenu();
    }

    getData() {
        const data = [];
        const context = `#${this.getContext().id} .card-resource`;

        utilities.get.getNodeList(context).forEach( (i) => {
            const item = {
                Region: utilities.get.getValue(`.modal-region select option:checked`, i),
                Country: utilities.get.getCountries(i),
                Population: utilities.get.getValue(`.modal-population`, i),
                Metrics: utilities.get.getValue(`.modal-metrics`, i),
                Intervention: utilities.get.getValue(`.modal-intervention select option:checked`, i),
                Outcome: utilities.get.getValue(`.modal-outcome select option:checked`, i),
                Description: utilities.get.getHTML(`.editor .ql-editor`, i)
            };

            data.push(item);
        });

        return data;
    }

    getMetadataType() {
        return window.gapmap.data.applicationDB.resourceMetadata;
    }
}

const receiveData = async (url) => {
    const response = await fetch(url);
    return await response.json();
};

const saveResource = (id) => {
    const webAbsoluteUrl = _spPageContextInfo.webAbsoluteUrl;
    const resourceList = window.gapmap.data.applicationDB.resourceList;
    const url = `${webAbsoluteUrl}/_api/web/lists/GetByTitle('${resourceList}')/items${id ? `(${id})` : ``}`;

    const item = new SharepointListItem();

    const options = {
        method: "POST",
        credentials: "same-origin",
        headers: { 
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": document.getElementById('__REQUESTDIGEST').value
        },
        body: JSON.stringify(item)
    };

    // id ? console.log('edit', item) : console.log('save', item);
    fetch(url, options);

    // send attachment
};

const deleteResource = (id) => {
    console.log('deleteResource', id);
};

const modifyParameters = () => {
    console.log('modifyParameters', window.gapmap.settingsId);
};

export { receiveData, saveResource, deleteResource, modifyParameters };