import "../css/gapmap.css";

class GapMap {
    constructor(data) {
        this.data = data;
        this.view = 0;
        this.tooltips = null;
        this.matrix = {0 : {}, 1: {}};
        this.current = this.getCurrent(data);
        this.maxStudyViewValue = this.getMax(data, "studyView");
        this.maxImpactViewValue = this.getMax(data, "impactView");
    }

    initMatrix() {
        this.matrix = {
            0: {},
            1: {}
        };
    }

    getCurrent(data) {
        let result = [];

        data.resources.forEach((i) => {
            i.Data.forEach((d) => {
                result.push(new GapmapResource(i, d));
            });
        });

        return result;
    }

    getMax(data, context) {
        let maxValues = [];

        data.interventions.forEach( (c) => {
            const intervention = c.Title;

            data.outcomes.forEach( (f) => {
                const outcome = f.Title;

                let x = [];
                let y = [];
                let z = [];
                let isInArray = [];
    
                data.resources.forEach((i) => {
                    const id = i.Id;

                    i.Data.forEach((d) => {
                        const a = data.interventions[parseInt(d.Intervention) -1].Title;
                        const b = data.outcomes[parseInt(d.Outcome) -1].Title;

                        if (a == intervention && b == outcome) {
                            if (context == "studyView" && !isInArray.includes(id)) {
                                switch (i.Study) {
                                    case "Systematic review":
                                        x.push(i);
                                        break;
                                    case "Impact evaluations":
                                        y.push(i);
                                        break;
                                    default:
                                        z.push(i);
                                        break;
                                }
                            
                                isInArray.push(id);

                            } else if (context == "impactView") {
                                switch (d.Impact) {
                                    case "Positive":
                                        x.push(i);
                                        break;
                                    case "Mixed":
                                        y.push(i);
                                        break;
                                    case "Negative":
                                        z.push(i);
                                        break;
                                }
                            }
                        }
                    });
                });

                maxValues.push(Math.max(...[x.length, y.length, z.length]));
            });
        });
    
        return Math.max(...maxValues);
    }

    removeTooltips() {
        Object.values(gapmap.tooltips).forEach( (i) => i.destroy() );
    }
}

class Settings extends GapMap {
    constructor(data, options) {
        super(data);
        this.selectResource = options.selectResource;
        this.addDate = options.addDate;
        this.editDate = options.editDate;
        this.sortInterventions = options.sortInterventions;
        this.sortOutcomes = options.sortOutcomes;
        this.interventionsOrder = options.interventionsOrder;
        this.outcomesOrder = options.outcomesOrder;
    }
}

class GapmapResource {
    constructor(item, selection) {
        this.Title = item.Title;
        this.Author = item.Author0;
        this.Evidence = item.Evidence;
        this.Study = item.Study;
        this.AttachmentFiles = this.getAttachment(item.AttachmentFiles);
        this.Country = selection.Country;
        this.Region = selection.Region;
        this.Intervention = selection.Intervention;
        this.Outcome = selection.Outcome;
        this.Impact = selection.Impact;
    }

    getAttachment(element) {
        if (element.results.length) {
            return {
                FileName: element.results[0].FileName,
                URL: element.results[0].ServerRelativeUrl
            };
        }

        return {};
    }
}

export { GapMap, Settings, GapmapResource }