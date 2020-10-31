import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../src/css/main.css";
import utilities from "./js/utilities.js";
import { receiveData } from "./js/requests.js";
import { settingsTemplate, addSettingsListeners, settingsOptions } from "../src/js/settings.js";
import { headerTemplate, addHeaderListeners } from "../src/js/header.js";
import { GapMap, Settings } from "../src/js/gapmap.js";

initGapmap();

function initGapmap() {
    // const site = _spPageContextInfo.webServerRelativeUrl;
    const settingsList = 'gapmap-settings';
    const resourceList = 'gapmap-data';
    const pipelineList = 'gapmap-pipeline';
    const pipelineMetadata = 'SP.Data.GapmappipelineListItem';
    const resourceMetadata = 'SP.Data.GapmapdataListItem';

    // const userData = `${site}/_api/web/currentuser/?$expand=groups`;
    // const settingsData = `${site}/_api/web/lists/getbytitle('${settingsList}')/items${queryOptions('settings')}`;
    // const projectsData = `${site}/_api/web/lists/getbytitle('${pipelineList}')/items${queryOptions('projects')}`;
    // const resourceData = `${site}/_api/web/lists/getbytitle('${resourceList}')/items${queryOptions('resources')}`;

    const userData = '/api/user.json';
    const settingsData = '/api/data.json';
    const projectsData = '/api/projects.json';
    const resourceData = '/api/resources.json';

    receiveData(userData).then( (user) => {
        const isAdmin = !!user.d.Groups.results.filter( (i) => (i.Title == "Tools Owners")).length;

        receiveData(settingsData).then( (settings) => {
            const data = createData(settings.d.results[0], settingsList, resourceList, pipelineList, pipelineMetadata, resourceMetadata);

            receiveData(projectsData).then( (projectsData) => {
                data.projects = createProjects(projectsData);

                receiveData(resourceData).then( (resources) => {
                    const dialog = document.getElementById("gapmap-dialog");
                    const settingsButton = document.querySelector('.navbar-collapse');
    
                    data.resources = createResources(resources);
    
                    if (isAdmin) {
                        dialog.innerHTML = settingsTemplate(data);
    
                        window.gapmap = new Settings(data, settingsOptions(data));
                        addSettingsListeners();
    
                    } else {
                        settingsButton.remove();
    
                        window.gapmap = new GapMap(data);
                    }
    
                    document.getElementById("gapmap-header").innerHTML = headerTemplate(data);
                    utilities.updateView();
                    addHeaderListeners();
                    // autoUpdateToken(site);
                });
            });
        });
    });
}

function autoUpdateToken(site) {
    setInterval( () => {
        UpdateFormDigest(site, _spFormDigestRefreshInterval);
    }, 15 * 60000);
}

function queryOptions(target) {
    const columns = {
        settings: ["Id", "regions", "countries", "languages", "evidence", "incomes", "interventions", "outcomes"],
        projects: ["Id", "Title", "Status", "Region", "IntOut", "Originator"],
        resources: ["Id", "Attachments", "AttachmentFiles", "Title", "label", "value", "Evidence", "Language", "Date", "Data", "Study", "Author0"]
    };

    const expand = `&$expand=AttachmentFiles`;
    const select = `&$select=${columns[target].join()}`;

    return `?$top=5000${expand}${select}`;
}

function createResources(resources) {
    return resources.d.results.map( (item) => {
        let resource = item;

        resource.Data = JSON.parse(item.Data).map( (f) => {
            let element = f;

            f.Income = f.Income ? f.Income.split('; ') : [];
            f.Region = f.Region ? f.Region.split('; ') : [];
            f.Country = f.Country ? f.Country.split('; ') : [];
        
            return element;
        });

        return resource;
    });
}

function createProjects(projects) {
    return projects.d.results.map( (i) => {
        let project = {};

        project.Id = i.Id;
        project.Title = i.Title;
        project.value = i.Title;
        project.label = i.Title;
        project.Status = i.Status;
        project.Region  = i.Region;
        project.IntOut = i.IntOut;
        project.Originator = i.Originator;
        project.etag = i.__metadata.etag;

        return project;
    });
}

function createData(data, settingsList, resourceList, pipelineList, pipelineMetadata, resourceMetadata) {
    let result = {};

    result.view = 0;
    result.regions = JSON.parse(data.regions);
    result.countries = JSON.parse(data.countries);
    result.languages = JSON.parse(data.languages);
    result.evidence = JSON.parse(data.evidence);
    result.incomes = JSON.parse(data.incomes);
    result.interventions = JSON.parse(data.interventions);
    result.outcomes = JSON.parse(data.outcomes);
    result.storage = {
        settingsId: data.Id,
        settingsList: settingsList,
        settingsMetadata: data.__metadata.type,
        pipelineList: pipelineList,
        pipelineMetadata: pipelineMetadata,
        resourceList: resourceList,
        resourceMetadata: resourceMetadata
    };

    return result;
}