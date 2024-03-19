"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNegativeStatus = exports.getPositiveStatus = void 0;
function getPositiveStatus(state) {
    return { isApplied: true, state };
}
exports.getPositiveStatus = getPositiveStatus;
function getNegativeStatus(state) {
    return { isApplied: false, state };
}
exports.getNegativeStatus = getNegativeStatus;
