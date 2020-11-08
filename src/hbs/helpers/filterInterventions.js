module.exports = function(value) {
    const allInterventions = gapmap.data.interventions.map((i) => i.Title);
    const intervention = allInterventions.indexOf(value) + 1;
    const result = gapmap.current.filter((i) => parseInt(i.Intervention) == intervention);

    return result.length;
};