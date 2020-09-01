module.exports = function(a, b, block) {
    return (a == b) ? block.fn(this) : block.inverse(this);
};