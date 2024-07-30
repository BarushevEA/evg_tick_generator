"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultMeasureMeter = exports.Measure = void 0;
const GMeter_1 = require("./GMeter");
const gMeter = new GMeter_1.GMeter();
function Measure(measurementName, gMeterOptional) {
    const meter = gMeterOptional ? gMeterOptional : gMeter;
    meter.start();
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        let targetName = target.name || "this";
        const funcType1 = Object.prototype.toString.call(originalMethod);
        const funcType2 = originalMethod[Symbol.toStringTag];
        const isAsync = funcType1 === '[object AsyncFunction]' || funcType2 === 'AsyncFunction';
        let decorated;
        if (isAsync) {
            const decorationName = measurementName || `Async method: ${targetName}.${propertyKey}`;
            descriptor.value = function (...args) {
                !decorated && (decorated = meter.decorateAsync(decorationName, () => originalMethod.apply(this, args)));
                return decorated();
            };
        }
        else {
            const decorationName = measurementName || `Sync method: ${targetName}.${propertyKey}`;
            descriptor.value = function (...args) {
                !decorated && (decorated = meter.decorate(decorationName, () => originalMethod.apply(this, args)));
                return decorated();
            };
        }
    };
}
exports.Measure = Measure;
function getDefaultMeasureMeter() {
    return gMeter;
}
exports.getDefaultMeasureMeter = getDefaultMeasureMeter;
