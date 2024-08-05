import { IGenerator, Status } from "./Types";
import { Observable } from "evg_observable/src/outLib/Observable";
import { EState } from "./Env";
import { ICallback, ISubscriptionLike } from "evg_observable/src/outLib/Types";
export declare abstract class AbstractGenerator implements IGenerator {
    protected state$: Observable<EState>;
    get state(): EState;
    start(): Status;
    abstract startProcess(): Status;
    stop(): Status;
    abstract stopProcess(): Status;
    destroy(): Status;
    subscribeOnState(callback: ICallback<EState>): ISubscriptionLike | undefined;
    subscribeOnProcess(callback: ICallback<EState>): ISubscriptionLike | undefined;
    isDestroyed(): boolean;
}
