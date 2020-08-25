module.exports = function(interventionIndex, outcomeIndex) {
    const context = gapmap.view;
    const resources = gapmap.data.current ? gapmap.data.current : gapmap.data.resources;
    const intervention = gapmap.data.interventions[parseInt(interventionIndex)].Title;
    const outcome = gapmap.data.outcomes[parseInt(outcomeIndex)].Title;

    const getClass = (dotIndex, context) => {
        switch (true) {
            case (dotIndex == 0 && context == 0):
                return "gapmap-dot-red";
            case (dotIndex == 1 && context == 0):
                return "gapmap-dot-blue";
            case (dotIndex == 2 && context == 0):
                return "gapmap-dot-grey";
            case (dotIndex == 0 && context == 1):
                return "gapmap-dot-green";
            case (dotIndex == 1 && context == 1):
                return "gapmap-dot-yellow";
            case (dotIndex == 2 && context == 1):
                return "gapmap-dot-red";
        }
    };

    const getSize = (length, context) => {
        const max = (context == 0) ? gapmap.maxStudyViewValue : gapmap.maxImpactViewValue;
        const scaleRange = [12, 24];
        const minMax = [1, max];
        const size = parseInt( ((scaleRange[1] - scaleRange[0]) * (length - minMax[0]) / (minMax[1] - minMax[0])) + scaleRange[0] );
        
        return `width: ${size}px;height: ${size}px;`;
    };

    const createDot = (length, interventionIndex, outcomeIndex, dotIndex, context) => {
        if (length) {
            const x = interventionIndex;
            const y = outcomeIndex;
            const v = dotIndex;
            const w = getSize(length, context);
            const z = getClass(v, context);

            return `<span id="dot-${x}-${y}-${v}" class="gapmap-dot ${z}" style="${w}"></span>`;

        } else {
            return '';

        }
    };

    let result = {
        a: [],
        b: [],
        c: []
    };
    let isInArray = [];

    resources.forEach((i) => {
        const id = i.Id;

        i.Data.forEach((d) => {
            const a = gapmap.data.interventions[parseInt(d.Intervention) -1].Title;
            const b = gapmap.data.outcomes[parseInt(d.Outcome) -1].Title;

            if (a == intervention && b == outcome && !isInArray.includes(id)) {
                if (context == 0 && !isInArray.includes(id)) {
                    switch (i.Study.toLowerCase()) {
                        case "systematic review":
                            result.a.push(i);
                            break;
                        case "impact evaluation":
                            result.b.push(i);
                            break;
                        default:
                            result.c.push(i);
                            break;
                    }

                    isInArray.push(id);

                } else if (context == 1) {
                    switch (d.Impact) {
                        case "Positive":
                            result.a.push(i);
                            break;
                        case "Mixed":
                            result.b.push(i);
                            break;
                        case "Negative":
                            result.c.push(i);
                            break;
                    }
                }
            }
        });
    });

    let a = createDot(result.a.length, interventionIndex, outcomeIndex, 0, context);
    let b = createDot(result.b.length, interventionIndex, outcomeIndex, 1, context);
    let c = createDot(result.c.length, interventionIndex, outcomeIndex, 2, context);

    return a + b + c;
};