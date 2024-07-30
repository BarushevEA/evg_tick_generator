import { AbstractGenerator } from "./AbstractGenerator";
import { OrderedObservable } from "evg_observable/src/outLib/OrderedObservable";
import { EState } from "./Env";
import { ICallback, IOrderedSubscriptionLike } from "evg_observable/src/outLib/Types";
export declare abstract class AbstractOrderedGenerator extends AbstractGenerator {
    protected state$: OrderedObservable<EState>;
    subscribeOnState(callback: ICallback<EState>): IOrderedSubscriptionLike | undefined;
    subscribeOnProcess(callback: ICallback<EState>): IOrderedSubscriptionLike | undefined;
}
