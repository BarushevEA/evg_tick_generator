import {Observable} from "evg_observable/src/outLib/Observable";
import {EState} from "./Env";
import {ICallback, IOrder, ISubscriptionLike} from "evg_observable/src/outLib/Types";

export type ITickGenerator = {
    state: EState;
    animationState: EState;

    stateSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    animationSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    animationBeforeSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    animationAfterSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    animationStateSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    runAnimation(): void;
    stopAnimation(): void;
    destroy(): void;
}
