"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvg = exports.getMinNumNotZero = exports.getMin = exports.getMax = exports.getNegative = exports.getPositive = void 0;
function getPositive(state) {
    return { isApplied: true, state };
}
exports.getPositive = getPositive;
function getNegative(state) {
    return { isApplied: false, state };
}
exports.getNegative = getNegative;
function getMax(a, b) {
    return (a > b) ? a : b;
}
exports.getMax = getMax;
function getMin(a, b) {
    return (a > b) ? b : a;
}
exports.getMin = getMin;
function getMinNumNotZero(a, b) {
    if (a === 0) {
        return b;
    }
    else if (b === 0) {
        return a;
    }
    else {
        return (a > b) ? b : a;
    }
}
exports.getMinNumNotZero = getMinNumNotZero;
function getAvg(a, b) {
    return Math.round((a + b) / 2);
}
exports.getAvg = getAvg;
