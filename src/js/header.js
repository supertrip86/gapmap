const template = require("../hbs/header.hbs");
const css = require("../css/header.css");

const target = "gapmap-header";

const createHeader = () => {
    const element = document.getElementById(target);
    element.innerHTML = template();
}

export { css, createHeader };