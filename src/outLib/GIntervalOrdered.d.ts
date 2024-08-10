import { IInterval, milliseconds, Status } from "./Types";
import { AbstractOrderedGenerator } from "./AbstractOrderedGenerator";
export declare class GIntervalOrdered extends AbstractOrderedGenerator implements IInterval {
    private id;
    private delay;
    constructor();
    setInterval(delay: milliseconds): Status;
    startProcess(): Status;
    stopProcess(): Status;
}
