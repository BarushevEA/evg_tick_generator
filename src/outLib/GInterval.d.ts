import { IGenerator, IInterval, milliseconds, Status } from "./Types";
import { EState } from "./Env";
import { ICallback, ISubscriptionLike } from "evg_observable/src/outLib/Types";
export declare class GInterval implements IGenerator, IInterval {
    private intervalId;
    private delay;
    private state$;
    get state(): EState;
    setInterval(delay: milliseconds): Status;
    start(): Status;
    stop(): Status;
    destroy(): Status;
    subscribeOnState(callback: ICallback<EState>): ISubscriptionLike | undefined;
    subscribeOnProcess(callback: ICallback<EState>): ISubscriptionLike | undefined;
    isDestroyed(): boolean;
}
