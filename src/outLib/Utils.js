"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvgNum = exports.getMinNumNotZero = exports.getMinNum = exports.getMaxNum = exports.getNegativeStatus = exports.getPositiveStatus = void 0;
const getPositiveStatus = (state) => {
    return { isApplied: true, state };
};
exports.getPositiveStatus = getPositiveStatus;
const getNegativeStatus = (state) => {
    return { isApplied: false, state };
};
exports.getNegativeStatus = getNegativeStatus;
const getMaxNum = (a, b) => {
    return (a > b) ? a : b;
};
exports.getMaxNum = getMaxNum;
const getMinNum = (a, b) => {
    return (a > b) ? b : a;
};
exports.getMinNum = getMinNum;
const getMinNumNotZero = (a, b) => {
    if (a === 0) {
        return b;
    }
    else if (b === 0) {
        return a;
    }
    else {
        return (a > b) ? b : a;
    }
};
exports.getMinNumNotZero = getMinNumNotZero;
const getAvgNum = (a, b) => {
    return Math.round((a + b) / 2);
};
exports.getAvgNum = getAvgNum;
