import {EState} from "./Env";
import {ICallback, ISubscriptionLike} from "evg_observable/src/outLib/Types";

export type milliseconds = number;

export type ITickGenerator = {
    state: EState;
    stateSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    destroy(): void;
}

export type IAnimation = {
    animationState: EState;
    animationSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    animationBeforeSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    animationAfterSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    animationStateSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    runAnimation(): void;
    stopAnimation(): void;
}

export type ITickHandler = {
    tickHandlerState: EState;
    interval10Subscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    interval100Subscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    interval500Subscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    interval1000Subscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    intervalCustom(callback: ICallback<any>, delay: milliseconds): ISubscriptionLike<any>;
    runTickHandler(): void;
    stopTickHandler(): void;
}
