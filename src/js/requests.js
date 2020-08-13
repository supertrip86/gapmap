import utilities from "../js/utilities.js";

const receiveData = async (url) => {
    const options = {
        method: "GET",
        credentials: "same-origin",
        headers: {"Accept": "application/json;odata=verbose"}
    };

    const response = await fetch(url, options);
    return await response.json();
};

const saveResource = (id) => {
    const webAbsoluteUrl = _spPageContextInfo.webAbsoluteUrl;
    const resourceList = gapmap.data.storage.resourceList;
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

    if (id) {
        options.headers["IF-MATCH"] = "*";
        options.headers["X-Http-Method"] = "MERGE";
    }

    fetch(url, options).then( (data) => {
        const context = utilities.getContext();
        const attachment = context.querySelector('.attachment-fileinput').files;
        
        if (attachment.length) {

            if (id) {
                saveAttachment(id, attachment);
            } else {
                data.json().then( (result) => {
                    saveAttachment(result.d.Id, attachment);
                });
            }

        }
    });

};

const deleteResource = (id) => {
    console.log('deleteResource', id);
};

const saveAttachment = (itemId, attachment) => {
    const webAbsoluteUrl = _spPageContextInfo.webAbsoluteUrl;
    const resourceList = gapmap.data.storage.resourceList;

    getFileBuffer(attachment[0]).then( (buffer) => {
        const attachmentURL = `${webAbsoluteUrl}/_api/web/lists/GetByTitle('${resourceList}')/items(${itemId})/AttachmentFiles/add(FileName='${attachment[0].name}')`;
        const createitem = new SP.RequestExecutor(webAbsoluteUrl);
        const bytes = new Uint8Array(buffer);

        let binary = '';
        
        bytes.forEach( (i) => binary += String.fromCharCode(i) );

        createitem.executeAsync({
            url: attachmentURL,
            method: "POST",
            binaryStringRequestBody: true,
            state: "Update",
            body: binary,
            success: () => {
                location.reload();
            },
            error: () => {
                throw new TypeError("Failed to upload the attachment");
            }
        });

    });

    function getFileBuffer(attachment) {
        let promise = new Promise( (resolve, reject) => {
            let reader = new FileReader();

            reader.onload = (e) => {
                resolve(e.target.result);
            };
            reader.onerror = (e) => {
                reject(e.target.error);
            }
            reader.readAsArrayBuffer(attachment);
        });

        return promise;
    }
};

const deleteAttachment = (attachment) => {
    console.log('delete', attachment);

    // TODO: delete attachment from list, then call location.reload() // no need for utilities.unLock()
    utilities.unLock();
};

const modifyParameters = () => {
    console.log('modifyParameters', gapmap.data.storage.settingsId);
};

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
                Region: utilities.get.getOptions('.modal-region', i),
                Country: utilities.get.getOptions('.modal-country', i),
                Impact: utilities.get.getValue(`.modal-impact option:checked`, i),
                Population: utilities.get.getValue(`.modal-population`, i),
                Metrics: utilities.get.getValue(`.modal-metrics`, i),
                Paragraphs: utilities.get.getValue(`.modal-paragraphs`, i),
                Intervention: utilities.get.getValue(`.modal-intervention select option:checked`, i),
                Outcome: utilities.get.getValue(`.modal-outcome select option:checked`, i),
                Description: utilities.get.getHTML(`.editor .ql-editor`, i)
            };

            data.push(item);
        });

        return data;
    }
    getMetadataType() {
        return gapmap.data.storage.resourceMetadata;
    }
}

export { receiveData, saveResource, deleteResource, deleteAttachment, modifyParameters };