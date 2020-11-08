module.exports = function(value) {
    const allOutcomes = gapmap.data.outcomes.map((i) => i.Title);
    const outcome = allOutcomes.indexOf(value) + 1;
    const result = gapmap.current.filter((i) => parseInt(i.Outcome) == outcome);

    return result.length;
};