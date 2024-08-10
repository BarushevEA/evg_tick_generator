import { GMeter } from "./GMeter";
import { IMeter } from "./Types";
export declare function Measure(measurementName?: string, gMeterOptional?: GMeter): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function getDefaultMeasureMeter(): IMeter;
