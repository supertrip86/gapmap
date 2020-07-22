const utilities = require("../js/utilities.js");

const receiveData = async (url) => {
    const response = await fetch(url);
    return await response.json();
}

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

    sendData(createResource('__Test'));

    function createResource(listMetadata) {
        /* 
            * correct metadata properties
            * fix queryselectorall to point to add resources tab 
        */
        return {
            Title: utilities.get.getValue('#attachment-title'),
            Evidence: utilities.get.getValue('#modal-evidence select option:checked'),
            Language: utilities.get.getValue('.modal-language option:checked'),
            Region: utilities.get.getValue('.modal-region select option:checked'),
            Country: utilities.get.getText('#modal-country .select-pure__label'),
            Date: utilities.get.getDate('#modal-datepicker'),
            Author: utilities.get.getValue('#modal-author'),
            Study: utilities.get.getValue('#modal-study'),
            Population: utilities.get.getValue('#modal-population'),
            Estimators: utilities.get.getValue('#modal-estimators'),
            Metrics: utilities.get.getValue('#modal-metrics'),
            Control: utilities.get.getValue('#modal-control select option:checked'),
            Intervention: utilities.get.getValue('#modal-intervention select option:checked'),
            Outcome: utilities.get.getValue('#modal-outcome select option:checked'),
            Description: utilities.get.getHTML('#editor .ql-editor'),
            __metadata: {
                type: listMetadata
            }
        }
    }

};

export { receiveData, addResource };