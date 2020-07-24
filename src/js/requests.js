const utilities = require("../js/utilities.js");

class SharepointListItem {
    constructor(listMetadata) {
        this.Title = utilities.get.getValue('#modal-add .attachment-title');
        this.label = utilities.get.getValue('#modal-add .attachment-title');
        this.value = utilities.get.getValue('#modal-add .attachment-title');
        this.Evidence = utilities.get.getValue('#modal-add .modal-evidence select option:checked');
        this.Language = utilities.get.getValue('#modal-add .modal-language option:checked');
        this.Region = utilities.get.getValue('#modal-add .modal-region select option:checked');
        this.Country = utilities.get.getText('#modal-add .modal-country .select-pure__label');
        this.Date = utilities.get.getDate('#modal-add .modal-datepicker');
        this.Author = utilities.get.getDate('#modal-add .modal-author');
        this.Study = utilities.get.getValue('#modal-add .modal-study');
        this.Population = utilities.get.getValue('#modal-add .modal-population');
        this.Estimators = utilities.get.getValue('#modal-add .modal-estimators');
        this.Metrics = utilities.get.getValue('#modal-add .modal-metrics');
        this.Control = utilities.get.getValue('#modal-add .modal-control select option:checked');
        this.Intervention = utilities.get.getValue('#modal-add .modal-intervention select option:checked');
        this.Outcome = utilities.get.getValue('#modal-add .modal-outcome select option:checked');
        this.Description = utilities.get.getHTML('#modal-add .editor .ql-editor');
        this.__metadata = { type: listMetadata };
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