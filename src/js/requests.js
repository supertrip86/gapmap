const utilities = require("../js/utilities.js");

const receiveData = async (url) => {
    const response = await fetch(url);
    return await response.json();
}

const sendData = (resource) => {
    console.log(resource);
};

const addResource = () => {

    sendData(createResource('__Test'));

    function createResource(listMetadata) {
        /* 
            * correct metadata properties
            * fix queryselectorall to point to add resources tab 
        */
        return {
            Title: utilities.getValue('.modal-file-title'),
            Language: utilities.getValue('.modal-language option:checked'),
            Region: utilities.getValue('.modal-region select option:checked'),
            Country: utilities.getText('#modal-country .select-pure__label'),
            Author: utilities.getValue('.modal-author'),
            __metadata: {
                type: listMetadata
            }
        }
    }

};

export { receiveData, addResource };