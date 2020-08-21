import Swal from 'sweetalert2/dist/sweetalert2.min.js';
import "sweetalert2/dist/sweetalert2.min.css";

const errorList = {
    invalidFile: 'You can only upload Word, Powerpoint, Excel or PDF documents',
    invalidFilename: 'The selected file has any of the following invalid characters:<br>~, #, %, & , *, {, }, \, :, <, >, ?, /, |, \', "',
    invalidFileSize: 'The selected file exceeds the maximum limit of 20 Megabytes',
    invalidTitle: 'This Resource exists already',
    invalidInput: 'The maximum number of characters for each input field is 250',
    invalidDescription: 'You exceeded the maximum number of characters of the Description field',
    addFormInvalid: 'Missing or invalid information',
    resourceNotFound: 'The changes you made cannot be saved.<br>This Resource has been deleted by another user while you were working on it.<br><br>Reload the Gapmap to update the list of available Resources',
    resourceModified: 'The selected Resource has been modified by another user while you were working on it.<br><br>To prevent overriding changes, reload the Gapmap and access this Resource again.',
    selectResource: 'Select a Resource from the menu',
    saveResource: 'Are you sure you want to save?',
    deleteResource: 'Are you sure you want to delete this Resource?',
    deleteAttachment: 'Do you want to delete this Document?',
    modifyParameters: 'You are about to modify the Gapmap core parameters. Do you want to proceed?',
};

const display = (value, confirm, callback, arg) => {
    Swal.fire(
        new ModalError(value, confirm)
    ).then( (result) => {
        if (result.value && callback) {
            return callback(arg);
        }
    });
};

class ModalError {
    constructor(value, confirm) {
        this.title = confirm ? 'Wait' : 'Warning';
        this.icon = confirm ? 'question' : 'warning';
        this.heightAuto = false;
        this.showCancelButton = confirm ? true : false;
        this.confirmButtonColor = '#003870';
        this.confirmButtonText = 'Yes';
        this.html = `<div><p>${errorList[value]}</p></div>`;
    }
};

export { display };