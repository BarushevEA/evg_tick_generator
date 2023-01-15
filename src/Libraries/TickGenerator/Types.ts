import {EState} from "./Env";
import {IListener, ISubscriptionLike} from "evg_observable/src/outLib/Types";

export type ms = number;

export type IBefore = {
    subscribeBefore(callback: IListener<EState>): ISubscriptionLike<EState> | undefined;
}

export type IAfter = {
    subscribeAfter(callback: IListener<EState>): ISubscriptionLike<EState> | undefined;
}

export type IListenerWrapper = IBefore & IAfter & ISubscriptionLike<EState>;

export type ISubscription = {
    subscribe(callback: IListener<EState>): IListenerWrapper | undefined;
};

export type ISensor = {
    detect(): void;
};

export type ILifeCircle = {
    start(): void;
    stop(): void;
    destroy(): void;
}

export type ITimeout = {
    setTime(time: ms): void;
};

export type IInterval = {
    setInterval(time: ms): void;
};
