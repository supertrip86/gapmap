import jbox from "jbox";
import utilities from "../js/utilities.js";
import { GapmapResource } from "../js/gapmap.js";
import gapmapTemplate from "../hbs/gapmap.hbs";
import headerTemplate from "../hbs/header.hbs";
import "jbox/dist/jBox.all.css";
import "../css/header.css";

const updateView = () => {
	let tooltips = {};

	if (gapmap.tooltips) {
		gapmap.removeTooltips();
	}

	gapmap.initMatrix();

	document.getElementById("gapmap-content").innerHTML = gapmapTemplate(gapmap.data);

	utilities.get.getNodeList('.gapmap-dot').forEach( (i) => {
		const id = i.id;
		const style = i.className.replace('gapmap-dot ', '');

		tooltips[id] = new jbox('Tooltip', utilities.options.tooltipOptions(id, style));
	});

	gapmap.tooltips = tooltips;
}

const switchView = (e) => {
    gapmap.data.view = parseInt(e.target.dataset.view);
    updateView();
};

const isResourceIncluded = (resource, target, values) => {
    let a = false;

    resource[target].forEach( (j) => {
        if (values.includes(j)) {
            a = true;
        }
    });

    return a;
};

const updateData = () => {
    const regions = utilities.get.getNodeList('.dropdown-region input:checked').map( (i) => i.parentNode.innerText );
    const totalRegions = utilities.get.getNodeList('.dropdown-region input').length;
    const countries = utilities.get.getNodeList('.dropdown-country input:checked').map( (i) => i.parentNode.innerText );
    const totalCountries = utilities.get.getNodeList('.dropdown-country input').length;
    const evidence = utilities.get.getNodeList('.dropdown-evidence input:checked').map( (i) => i.parentNode.innerText );
    const isRegionFilterActive = regions.length != totalRegions;
    const isCountryFilterActive = countries.length != totalCountries;

    let result = [];

    gapmap.data.resources.forEach((f) => {
        const evidenceType = f.Evidence;

        if (evidence.includes(evidenceType)) {
            f.Data.forEach((d) => {
                const isRegionIncluded = isResourceIncluded(d, 'Region', regions);
                const isCountryIncluded = isResourceIncluded(d, 'Country', countries);
                const isRegionEmpty = !d.Region.length;
                const isCountryEmpty = !d.Country.length;

                if (!isRegionFilterActive && !isCountryFilterActive) {
                    result.push(new GapmapResource(f, d));

                } else if (isRegionFilterActive && !isCountryFilterActive) {
                    (isRegionIncluded || isRegionEmpty) && result.push(new GapmapResource(f, d));

                } else if (!isRegionFilterActive && isCountryFilterActive) {
                    (isCountryIncluded || isCountryEmpty) && result.push(new GapmapResource(f, d));

                } else if (isRegionFilterActive && isCountryFilterActive) {
                    ((isRegionIncluded || isRegionEmpty) && (isCountryIncluded || isCountryEmpty)) && result.push(new GapmapResource(f, d));

                }
            });
        }
    });

    return result;
};

const dropdownReset = (e) => {
    const isReset = e.target.classList.contains("dropdown-item-clear");
    const target = Array.from(e.target.parentNode.querySelectorAll('.dropdown-item-element'));

    target.forEach( (i) => i.querySelector('input').checked = isReset );
    gapmap.current = updateData();
    updateView();

    e.stopPropagation();
};

const dropdownItemSelection = (e) => {
    const input = e.target.querySelector('input');
    const inputValue = input.checked;

    input.checked = !inputValue;
    gapmap.current = updateData(e);
    updateView();
    
    e.stopPropagation();
};

const addHeaderListeners = () => {
    utilities.on('#gapmap-header', 'click', '.dropdown-change-view', switchView);
    utilities.on('#gapmap-header', 'click', '.dropdown-control', dropdownReset);
    utilities.on('#gapmap-header', 'click', '.dropdown-item-element', dropdownItemSelection);
};

export { headerTemplate, updateView, addHeaderListeners }