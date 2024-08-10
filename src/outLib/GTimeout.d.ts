import { ITimeout, milliseconds, Status } from "./Types";
import { AbstractGenerator } from "./AbstractGenerator";
export declare class GTimeout extends AbstractGenerator implements ITimeout {
    private delay;
    private id;
    constructor();
    setTimeout(delay: milliseconds): Status;
    startProcess(): Status;
    stopProcess(): Status;
}
