import Swal from 'sweetalert2'

const errorList = {
    invalidFile: '<p>You can only upload Word, Powerpoint, Excel or PDF documents</p>',
    invalidFilename: '<p>The selected file has any of the following invalid characters:</p><p>~, #, %, & , *, {, }, \, :, <, >, ?, /, |, \', "</p>',
    invalidFileSize: '<p>The selected file exceeds the maximum limit of 20 Megabytes</p>',
    invalidTitle: '<p>This Resource exists already</p>',
    invalidInput: '<p>The maximum number of characters for each input field is 250</p>',
    invalidDescription: '<p>You exceeded the maximum number of characters of the Description field</p>',
    addFormInvalid: '<p>Missing or invalid information</p>',
    selectResource: '<p>Select a Resource from the menu</p>',
    saveResource: '<p>Are you sure you want to save?</p>',
    modifyParameters: '<p>You are about to modify the Gapmap core parameters. Do you want to proceed?</p>',
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
        this.confirmButtonText = 'Save';
        this.html = `<div>${errorList[value]}</div>`;
    }
};

export { display };