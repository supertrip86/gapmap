import $ from 'jquery';

const template = require("../hbs/settings.hbs");
const css = require("../css/settings.css");

const target = "gapmap-dialog";

const createSettings = () => {
    const element = document.getElementById(target);
    element.innerHTML = template();
}

// const 

const addListener = () => {
    /* bootstrap event shown.bs.modal to be triggered with jQuery */
    $('body').on('shown.bs.modal', function() {
        console.log($(this))
    });
};

export { css, createSettings, addListener };