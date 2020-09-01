module.exports = function(interventionIndex, outcomeIndex) {
    const context = gapmap.data.view;
    const resources = gapmap.current;
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
        0: [],
        1: [],
        2: []
    };

    resources.forEach((i) => {
        const a = gapmap.data.interventions[parseInt(i.Intervention) -1].Title;
        const b = gapmap.data.outcomes[parseInt(i.Outcome) -1].Title;

        if (a == intervention && b == outcome) {
            if (context == 0) {
                switch (i.Study.toLowerCase()) {
                    case "systematic review":
                        result[0].push(i);
                        break;
                    case "impact evaluation":
                        result[1].push(i);
                        break;
                    default:
                        result[2].push(i);
                        break;
                }

            } else if (context == 1) {
                switch (i.Impact) {
                    case "Positive":
                        result[0].push(i);
                        break;
                    case "Mixed":
                        result[1].push(i);
                        break;
                    case "Negative":
                        result[2].push(i);
                        break;
                }
            }
        }
    });

    gapmap.matrix[context][`${interventionIndex}-${outcomeIndex}`] = result;

    let a = createDot(result[0].length, interventionIndex, outcomeIndex, 0, context);
    let b = createDot(result[1].length, interventionIndex, outcomeIndex, 1, context);
    let c = createDot(result[2].length, interventionIndex, outcomeIndex, 2, context);

    return a + b + c;
};