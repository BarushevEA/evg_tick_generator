import {EState} from "./Env";
import {IListener, ISubscriptionLike} from "evg_observable/src/outLib/Types";

export type ms = number;
export type ITickCallback<T> = (state: T) => void;

export type IReaction = {
    subscribeBefore(callback: IListener<EState>): ISubscriptionLike<EState> | undefined;
    subscribeMain(callback: IListener<EState>): ISubscriptionLike<EState> | undefined;
    subscribeAfter(callback: IListener<EState>): ISubscriptionLike<EState> | undefined;
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
