const utilities = require("../js/utilities.js");

class SharepointListItem {
    constructor(listMetadata) {
        this.Title = utilities.get.getValue('#attachment-title');
        this.Evidence = utilities.get.getValue('#modal-evidence select option:checked');
        this.Language = utilities.get.getValue('#modal-language option:checked');
        this.Region = utilities.get.getValue('#modal-region select option:checked');
        this.Country = utilities.get.getText('#modal-country .select-pure__label');
        this.Date = utilities.get.getDate('#modal-datepicker');
        this.Author = utilities.get.getDate('#modal-datepicker');
        this.Study = utilities.get.getValue('#modal-study');
        this.Population = utilities.get.getValue('#modal-population');
        this.Estimators = utilities.get.getValue('#modal-estimators');
        this.Metrics = utilities.get.getValue('#modal-metrics');
        this.Control = utilities.get.getValue('#modal-control select option:checked');
        this.Intervention = utilities.get.getValue('#modal-intervention select option:checked');
        this.Outcome = utilities.get.getValue('#modal-outcome select option:checked');
        this.Description = utilities.get.getHTML('#editor .ql-editor');
        this.__metadata = { type: listMetadata };
    }
};

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
};

const addResource = () => {
    const item = new SharepointListItem('__Test');

    sendData(item);

    // function createResource(listMetadata) {
    //     /* 
    //         * correct metadata properties
    //         * fix queryselectorall to point to add resources tab 
    //     */
    //     return {
    //         Title: utilities.get.getValue('#attachment-title'),
    //         Evidence: utilities.get.getValue('#modal-evidence select option:checked'),
    //         Language: utilities.get.getValue('.modal-language option:checked'),
    //         Region: utilities.get.getValue('.modal-region select option:checked'),
    //         Country: utilities.get.getText('#modal-country .select-pure__label'),
    //         Date: utilities.get.getDate('#modal-datepicker'),
    //         Author: utilities.get.getValue('#modal-author'),
    //         Study: utilities.get.getValue('#modal-study'),
    //         Population: utilities.get.getValue('#modal-population'),
    //         Estimators: utilities.get.getValue('#modal-estimators'),
    //         Metrics: utilities.get.getValue('#modal-metrics'),
    //         Control: utilities.get.getValue('#modal-control select option:checked'),
    //         Intervention: utilities.get.getValue('#modal-intervention select option:checked'),
    //         Outcome: utilities.get.getValue('#modal-outcome select option:checked'),
    //         Description: utilities.get.getHTML('#editor .ql-editor'),
    //         __metadata: {
    //             type: listMetadata
    //         }
    //     }
    // }

};

export { receiveData, addResource };