module.exports = function(intervention) {
    return window.gapmap.data.interventions.filter( (i) => i.Id == intervention )[0].Color;
};