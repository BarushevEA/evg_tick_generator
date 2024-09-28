import { ITimeout, milliseconds, Status } from "./Types";
import { AbstractOrderedGenerator } from "./AbstractOrderedGenerator";
export declare class GTimeoutOrdered extends AbstractOrderedGenerator implements ITimeout {
    private delay;
    private id;
    constructor();
    setTimeout(delay: milliseconds): Status;
    startProcess(): Status;
    stopProcess(): Status;
}
