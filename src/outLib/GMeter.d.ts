import { IMeter, IUserMeterData, IUserMetrics, Status } from "./Types";
import { EState } from "./Env";
export declare class GMeter implements IMeter {
    private readonly metrics;
    private _state;
    private readonly perSecondTimer;
    private readonly perMinuteTimer;
    private readonly perHourTimer;
    private readonly perDayTimer;
    constructor();
    start(): Status;
    stop(): Status;
    destroy(): Status;
    isDestroyed(): boolean;
    deleteFunc(funcName: string): Status;
    private clearFunc;
    decorate<T>(funcName: string, func: (...args: any[]) => T): (...args: any[]) => T;
    private createMetric;
    decorateAsync<T>(funcName: string, func: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<T>;
    private addTimers;
    private addTimer;
    getMetrics(funcName: string): IUserMeterData;
    getAll(): IUserMetrics;
    get length(): number;
    get state(): EState;
}
