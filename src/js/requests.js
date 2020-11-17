import utilities from "../js/utilities.js";
import { display } from "../js/errorHandler.js";

const receiveData = async (url) => {
    const options = {
        method: "GET",
        credentials: "same-origin",
        headers: {"Accept": "application/json;odata=verbose"}
    };

    const response = await fetch(url, options);

    if (response.status == 404) {
        return display('resourceNotFound', false);
    }

    return await response.json();
};

const spData = (id) => {
    const site = _spPageContextInfo.webAbsoluteUrl;
    const context = utilities.currentMenu();
    const contextId = context.id;
    const resourceContext = contextId == 'modal-add' || contextId == 'modal-edit';
    const projectContext = contextId == 'modal-project-add' || contextId == 'modal-project-edit';

    if (resourceContext) {
        let list = gapmap.data.storage.resourceList;
        return {
            url: `${site}/_api/web/lists/GetByTitle('${list}')/items${id ? `(${id})` : ``}`,
            item: new SharepointResourceItem(context)
        }
    } else if (projectContext) {
        let list = gapmap.data.storage.pipelineList;

        return {
            url: `${site}/_api/web/lists/GetByTitle('${list}')/items${id ? `(${id})` : ``}`,
            item: new SharepointProjectItem(context)
        }
    }
};

const saveData = (id) => {
    const url = spData(id)['url'];
    const item = spData(id)['item'];

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

    utilities.startLoader();

    fetch(url, options).then( (data) => {
        const context = utilities.currentMenu();
        const attachment = context.querySelector('.attachment-fileinput');
        const attachmentFiles = attachment ? attachment.files.length : null;
        
        if (attachmentFiles) {

            if (id) {
                saveAttachment(id, attachment);
            } else {
                data.json().then( (result) => {
                    saveAttachment(result.d.Id, attachment);
                });
            }

        } else {
            location.reload();
        }
    });
};

const deleteItem = (id) => {
    const context = utilities.currentMenu().id;
    const list = (context == 'modal-edit') ? gapmap.data.storage.resourceList : gapmap.data.storage.pipelineList;
    const url = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('${list}')/items(${id})/recycle()`;

    const options = {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
            "X-RequestDigest": document.getElementById('__REQUESTDIGEST').value
        }
    };

    utilities.startLoader();

    fetch(url, options).then( () => location.reload() );
};

const saveAttachment = (itemId, attachment) => {
    getFileBuffer(attachment.files[0]).then( (buffer) => {
        const resourceList = gapmap.data.storage.resourceList;
        const attachmentURL = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/GetByTitle('${resourceList}')/items(${itemId})/AttachmentFiles/add(FileName='${attachment.files[0].name}')`;
        const createitem = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
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

const deleteAttachment = (attachmentUrl) => {
    const url = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/getFileByServerRelativeUrl('${attachmentUrl}')/recycle()`;

    const options = {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
            "X-RequestDigest": document.getElementById('__REQUESTDIGEST').value
        }
    };

    utilities.startLoader();

    fetch(url, options).then( () => location.reload() );
};

const modifyParameters = () => {
    const settingsList = gapmap.data.storage.settingsList;
    const id = gapmap.data.storage.settingsId;
    const url = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/GetByTitle('${settingsList}')/items(${id})`;

    const item = new SharepointSettingsItem();

    const options = {
        method: "POST",
        credentials: "same-origin",
        headers: { 
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-Http-Method": "MERGE",
            "IF-MATCH": "*",
            "X-RequestDigest": document.getElementById('__REQUESTDIGEST').value
        },
        body: JSON.stringify(item)
    };

    utilities.startLoader();

    fetch(url, options).then( () => location.reload() );
};

class SharepointResourceItem {
    constructor(context) {
        this.Title = utilities.get.getValue(`.attachment-title`, context);
        this.label = utilities.get.getValue(`.attachment-title`, context);
        this.value = utilities.get.getValue(`.attachment-title`, context);
        this.Evidence = utilities.get.getValue(`.modal-evidence select option:checked`, context);
        this.Language = utilities.get.getValue(`.modal-language option:checked`, context);
        this.Date = utilities.get.getDate(`.modal-datepicker`, context);
        this.Author0 = utilities.get.getValue(`.modal-author`, context);
        this.Study = utilities.get.getValue(`.modal-study`, context);
        this.Data = this.getData();
        this.__metadata = { type: gapmap.data.storage.resourceMetadata };
    }
    getData() {
        const data = [];
        const context = `#${utilities.currentMenu().id} .card-resource`;

        utilities.get.getNodeList(context).forEach( (i) => {
            const item = {
                Region: utilities.get.getOptions('.modal-region', i),
                Country: utilities.get.getOptions('.modal-country', i),
                Income: utilities.get.getOptions('.modal-income', i),
                Impact: utilities.get.getValue(`.modal-impact option:checked`, i),
                Population: utilities.get.getValue(`.modal-population`, i),
                Metrics: utilities.get.getValue(`.modal-metrics`, i),
                Crop: utilities.get.getValue(`.modal-crop`, i),
                Paragraphs: utilities.get.getValue(`.modal-paragraphs`, i),
                Intervention: utilities.get.getValue(`.modal-intervention select option:checked`, i),
                Outcome: utilities.get.getValue(`.modal-outcome select option:checked`, i),
                Description: utilities.get.getHTML(`.editor .ql-editor`, i)
            };

            data.push(item);
        });

        return JSON.stringify(data);
    }
}

class SharepointProjectItem {
    constructor(context) {
        this.Title = context.querySelector('.modal-project-title').value;
        this.IntOut = context.querySelector('.modal-project-intout').value;
        this.Region = context.querySelector('.modal-project-region').value;
        this.Status = parseInt(context.querySelector('.modal-project-status').value);
        this.Originator = context.querySelector('.modal-project-originator').value;
        this.__metadata = { type: gapmap.data.storage.pipelineMetadata };
    }
}

class SharepointSettingsItem {
    constructor() {
        this.interventions = this.getInterventions();
        this.outcomes = this.getOutcomes();
        this.__metadata = { type: gapmap.data.storage.settingsMetadata };
    }
    getInterventions() {
        const DOMelements = Array.from(document.querySelectorAll('.modal-intervention-title input'));
        const items = DOMelements.map( (i, j) => { return {Title: i.value, Id: (j + 1), Color: i.dataset.color} } );

        return JSON.stringify(items);
    }
    getOutcomes() {
        const DOMelements = Array.from(document.querySelectorAll('.modal-outcome-title input'));
        const items = DOMelements.map( (i, j) => { return {Title: i.value, Id: (j + 1)} } );

        return JSON.stringify(items);
    }
}

export { receiveData, saveData, deleteItem, deleteAttachment, modifyParameters };