import {GMeter} from "./GMeter";
import {IMeter} from "./Types";

const gMeter = new GMeter();

export function Measure(classNameOriginal?: string, gMeterOptional?: GMeter) {
    const meter = gMeterOptional ? gMeterOptional : gMeter;
    meter.start();

    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        let className = classNameOriginal || target.name || "";

        const funcType1 = Object.prototype.toString.call(originalMethod);
        const funcType2 = originalMethod[Symbol.toStringTag];
        const isAsync = funcType1 === '[object AsyncFunction]' || funcType2 === 'AsyncFunction';

        if (isAsync) {
            descriptor.value = function (...args: any[]) {
                const decorated = meter.decorateAsync(`Async method: ${className}.${propertyKey}`, () => originalMethod.apply(this, args));
                return decorated();
            };
        } else {
            descriptor.value = function (...args: any[]) {
                const decorated = meter.decorate(`Sync method: ${className}.${propertyKey}`, () => originalMethod.apply(this, args));
                return decorated();
            };
        }
    };
}

export function getDefaultMeasureMeter(): IMeter {
    return gMeter;
}
