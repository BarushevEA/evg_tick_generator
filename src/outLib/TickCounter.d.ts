import { ITickCounter, Status } from "./Types";
import { EState } from "./Env";
import { AbstractGenerator } from "./AbstractGenerator";
import { ICallback, ISubscriptionLike } from "evg_observable/src/outLib/Types";
export declare class TickCounter implements ITickCounter {
    private subject;
    private _state;
    private defaultPeriodMs;
    private periodMs;
    private timer;
    private sum;
    private counter;
    private counter$;
    private subscriber;
    constructor(subject: AbstractGenerator);
    private init;
    get state(): EState;
    getTicksPerPeriod(): number;
    getTicksSum(): number;
    resetPeriod(): Status;
    setPeriod(period: number): Status;
    subscribe(callback: ICallback<number>): ISubscriptionLike | undefined;
    start(): Status;
    stop(): Status;
    isDestroyed(): boolean;
    destroy(): Status;
}
