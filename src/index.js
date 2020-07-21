import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../src/css/main.css";
import { cssHeader, createHeader } from  "../src/js/header.js";
import { cssSettings, createSettings, addListener } from "../src/js/settings.js";

fetch('/data.json')
  .then(response => response.json())
  .then(data => console.log(data));

createHeader();
createSettings();
addListener();