import {EState} from "./Env";
import {IListener, ISubscriptionLike} from "evg_observable/src/outLib/Types";

export type ms = number;
export type ITickCallback<T> = (state: T) => void;

export type ITick = {
    subscribeBeforeTick(callback: IListener<EState>): ISubscriptionLike<EState> | undefined;
    subscribeTick(callback: IListener<EState>): ISubscriptionLike<EState> | undefined;
    subscribeAfterTick(callback: IListener<EState>): ISubscriptionLike<EState> | undefined;
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
    setTickTime(time: ms): void;
};

export type IInterval = {
    setTickInterval(time: ms): void;
};
