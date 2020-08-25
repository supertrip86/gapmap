import $ from "jquery";
import utilities from "../js/utilities.js";
import gapmapView from "../hbs/gapmap.hbs";
import headerTemplate from "../hbs/header.hbs";
import "../css/header.css";

const switchView = (e) => {
    gapmap.view = e.target.dataset.view;
    document.getElementById("gapmap-content").innerHTML = gapmapView(gapmap.data);
};

const updateData = (filter, values) => {
    let result = [];
    let isInArray = [];

    if (filter == "Region" || filter == "Country") {
        const separator = (filter == "Region") ? ', ' : '; ';

        gapmap.data.resources.forEach((i) => {
            const id = i.Id;

            i.Data.forEach((d) => {
                const target = d[filter].split(separator);

                target.forEach( (j) => {
                    if (values.includes(j) && !isInArray.includes(id)) {
                        isInArray.push(id);
                        result.push(i);
                    }
                });
            });
        });

    } else {
        gapmap.data.resources.forEach((i) => {            
            values.includes(i.Evidence) && result.push(i);
        });
    }

    return result;
};

const dropdownClose = (e) => {
    const filter = e.target.dataset.dropdown;

    if (filter != "View") {
        const total = Array.from(e.target.querySelectorAll('.dropdown-item-element input'));
        const checked = Array.from(e.target.querySelectorAll('.dropdown-item-element input:checked'));
        const values = checked.map( (i) => i.parentNode.innerText );

        if (values.length != total.length) {
            gapmap.data.current = updateData(filter, values);
            document.getElementById("gapmap-content").innerHTML = gapmapView(gapmap.data);

        } else {
            gapmap.data.current = null;
            document.getElementById("gapmap-content").innerHTML = gapmapView(gapmap.data);
        }
    }
};

const dropdownUncheck = (e) => {
    const target = Array.from(e.target.parentNode.querySelectorAll('.dropdown-item-element'));

    target.forEach( (i) => i.querySelector('input').checked = false );
    e.stopPropagation();
};

const dropdownReset = (e) => {
    const target = Array.from(e.target.parentNode.querySelectorAll('.dropdown-item-element'));

    target.forEach( (i) => i.querySelector('input').checked = true );
    e.stopPropagation();
};

const dropdownItemSelection = (e) => {
    const input = e.target.querySelector('input');
    const inputValue = input.checked;

    input.checked = !inputValue;
    e.stopPropagation();
};

const addHeaderListeners = () => {
    $('#gapmap-header').on('hide.bs.dropdown', dropdownClose); // change event in bootstrap triggered by jQuery

    utilities.on('#gapmap-header', 'click', '.dropdown-change-view', switchView);
    utilities.on('#gapmap-header', 'click', '.dropdown-item-uncheck', dropdownUncheck);
    utilities.on('#gapmap-header', 'click', '.dropdown-item-clear', dropdownReset);
    utilities.on('#gapmap-header', 'click', '.dropdown-item-element', dropdownItemSelection);
};

export { headerTemplate, addHeaderListeners }