"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultMeasureMeter = exports.Measure = void 0;
const GMeter_1 = require("./GMeter");
const gMeter = new GMeter_1.GMeter();
function Measure(classNameOriginal, gMeterOptional) {
    const meter = gMeterOptional ? gMeterOptional : gMeter;
    meter.start();
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        let className = classNameOriginal || target.name || "";
        const funcType1 = Object.prototype.toString.call(originalMethod);
        const funcType2 = originalMethod[Symbol.toStringTag];
        const isAsync = funcType1 === '[object AsyncFunction]' || funcType2 === 'AsyncFunction';
        if (isAsync) {
            descriptor.value = meter.decorateAsync(`Async method: ${className}.${propertyKey}`, originalMethod);
        }
        else {
            descriptor.value = meter.decorate(`Sync method: ${className}.${propertyKey}`, originalMethod);
        }
    };
}
exports.Measure = Measure;
function getDefaultMeasureMeter() {
    return gMeter;
}
exports.getDefaultMeasureMeter = getDefaultMeasureMeter;
