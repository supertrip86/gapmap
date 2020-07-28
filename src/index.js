import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../src/css/main.css";
import "../src/js/header.js";
import { receiveData } from "./js/requests.js";
import { settingsTemplate, addSettingsMenu, addListeners } from "../src/js/settings.js";

receiveData('/api/users.json').then( (user) => {
    const isAdmin = (user.role == "Administrator");

    receiveData('/api/data.json').then( (settings) => {
        const data = settings;

        receiveData('/api/resources.json').then( (resources) => {
            const dialog = document.getElementById("gapmap-dialog");
            const settingsButton = document.querySelector('.navbar-collapse');

            data.resources = resources;
            
            if (isAdmin) {
                dialog.innerHTML = settingsTemplate(data);
                addSettingsMenu(data, 1);
                addListeners();
            } else {
                settingsButton.remove();

                class GapMap {
                    constructor() {
                        this.data = data;
                    }
                }
            
                window.gapmap = new GapMap();
            }
        });
    });
});