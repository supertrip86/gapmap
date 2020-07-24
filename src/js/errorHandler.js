const swal = require('sweetalert2');

const errorList = {
    invalidFile: '<p>You can only upload Word, Powerpoint, Excel or PDF documents</p>',
    invalidFilename: '<p>The selected file has any of the following invalid characters:</p><p>~, #, %, & , *, {, }, \, :, <, >, ?, /, |, \', "</p>',
    invalidFileSize: '<p>The selected file exceeds the maximum limit of 20 Megabytes</p>',
    addFormInvalid: '<p>Missing or invalid information has been provided</p>'
};

const display = (value, confirm) => {
    swal.fire(new ModalError(value, confirm))
};

class ModalError {
    constructor(value, confirm) {
        this.title = 'Warning';
        this.icon = confirm ? 'question' : 'warning';
        this.heightAuto = false;
        this.showCancelButton = confirm ? true : false;
        this.confirmButtonColor = '#003870';
        this.confirmButtonText = 'Save';
        this.html = `<p>${errorList[value]}</p>`;
    }
};

export { display };