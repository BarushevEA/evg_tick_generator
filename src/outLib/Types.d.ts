import { EState } from "./Env";
import { ICallback, ISubscriptionLike } from "evg_observable/src/outLib/Types";
export declare type milliseconds = number;
export declare type ITickGenerator = {
    state: EState;
    stateSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    destroy(): void;
};
export declare type IAnimation = {
    animationState: EState;
    animationSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    animationBeforeSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    animationAfterSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    animationStateSubscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    runAnimation(): void;
    stopAnimation(): void;
};
export declare type ITickHandler = {
    tickHandlerState: EState;
    interval10Subscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    interval100Subscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    interval500Subscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    interval1000Subscribe(callback: ICallback<any>): ISubscriptionLike<any>;
    intervalCustom(callback: ICallback<any>, delay: milliseconds): ISubscriptionLike<any>;
    timeout(callback: ICallback<any>, delay: milliseconds): void;
    runTickHandler(): void;
    stopTickHandler(): void;
};
