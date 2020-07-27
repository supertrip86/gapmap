const utilities = require("../js/utilities.js");

class SharepointListItem {
    constructor(listMetadata) {
        this.Title = utilities.get.getValue(`#${this.getContext()} .attachment-title`);
        this.label = utilities.get.getValue(`#${this.getContext()} .attachment-title`);
        this.value = utilities.get.getValue(`#${this.getContext()} .attachment-title`);
        this.Evidence = utilities.get.getValue(`#${this.getContext()} .modal-evidence select option:checked`);
        this.Language = utilities.get.getValue(`#${this.getContext()} .modal-language option:checked`);
        this.Region = utilities.get.getValue(`#${this.getContext()} .modal-region select option:checked`);
        this.Country = utilities.get.getText(`#${this.getContext()} .modal-country .select-pure__label`);
        this.Date = utilities.get.getDate(`#${this.getContext()} .modal-datepicker`);
        this.Author = utilities.get.getValue(`#${this.getContext()} .modal-author`);
        this.Study = utilities.get.getValue(`#${this.getContext()} .modal-study`);
        this.Population = utilities.get.getValue(`#${this.getContext()} .modal-population`);
        this.Estimators = utilities.get.getValue(`#${this.getContext()} .modal-estimators`);
        this.Metrics = utilities.get.getValue(`#${this.getContext()} .modal-metrics`);
        this.Control = utilities.get.getValue(`#${this.getContext()} .modal-control select option:checked`);
        this.Intervention = utilities.get.getValue(`#${this.getContext()} .modal-intervention select option:checked`);
        this.Outcome = utilities.get.getValue(`#${this.getContext()} .modal-outcome select option:checked`);
        this.Description = utilities.get.getHTML(`#${this.getContext()} .editor .ql-editor`);
        this.__metadata = { type: listMetadata };
    }

    getContext() {
        return utilities.currentMenu().id;
    }
}

const receiveData = async (url) => {
    const response = await fetch(url);
    return await response.json();
};

const sendData = (resource) => {
    console.log(resource);
    // const par = {
    //     method: "POST",
    //     credentials: 'same-origin',
    //     headers: { 
    //         "Accept": "application/json;odata=verbose",
    //         "Content-Type": "application/json;odata=verbose",
    //         "X-RequestDigest": document.getElementById('__REQUESTDIGEST').value
    //     },
    //     body: JSON.stringify({
    //         Title: "asdasd",
    //         Date: new Date().toISOString(),
    //         __metadata: {
    //             type: "SP.Data.GapmapListItem"
    //         }
    //     })
    // };

    // fetch(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('gapmap')/items", par);

    // send attachment
};

const addResource = () => {
    const item = new SharepointListItem('__Test');

    sendData(item);

};

export { receiveData, addResource };