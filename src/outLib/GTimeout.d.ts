import { IGenerator, ITimeout, milliseconds, Status } from "./Types";
import { EState } from "./Env";
import { ICallback, ISubscriptionLike } from "evg_observable/src/outLib/Types";
export declare class GTimeout implements IGenerator, ITimeout {
    private state$;
    private delay;
    private timerId;
    get state(): EState;
    destroy(): Status;
    setTimeout(delay: milliseconds): Status;
    start(): Status;
    stop(): Status;
    subscribeOnState(callback: ICallback<EState>): ISubscriptionLike | undefined;
    subscribeOnProcess(callback: ICallback<EState>): ISubscriptionLike | undefined;
    isDestroyed(): boolean;
}
