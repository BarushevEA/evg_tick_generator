import { IInterval, milliseconds, Status } from "./Types";
import { AbstractGenerator } from "./AbstractGenerator";
export declare class GInterval extends AbstractGenerator implements IInterval {
    private intervalId;
    private delay;
    constructor();
    setInterval(delay: milliseconds): Status;
    startProcess(): Status;
    stopProcess(): Status;
}
