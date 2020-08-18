import $ from "jquery";
import utilities from "../js/utilities.js";
import headerTemplate from "../hbs/header.hbs";
import "../css/header.css";

const onDropdownClose = (e) => {
    // console.log(e.target.querySelectorAll('.dropdown-item'))
    const dropdown = e.target.dataset.dropdown;
    console.log(dropdown)
};

const dropdownClear = (e) => {
    const target = Array.from(e.target.parentNode.querySelectorAll('.dropdown-item-element'));

    target.forEach( (i) => i.querySelector('input').checked = true );
};

const dropdownItemSelection = (e) => {
    const input = e.target.querySelector('input');
    const inputValue = input.checked;

    input.checked = !inputValue;
    e.stopPropagation();
};

const addHeaderListeners = () => {
    $('#gapmap-header').on('hide.bs.dropdown', onDropdownClose); // change event in bootstrap triggered by jQuery

    utilities.on('#gapmap-header', 'click', '.dropdown-item-clear', dropdownClear);
    utilities.on('#gapmap-header', 'click', '.dropdown-item-element', dropdownItemSelection);
};

export { headerTemplate, addHeaderListeners }