import {ILifeCircle, IReaction, ISensor} from "./Types";
import {ICollector, IListener, IObserver, ISubscriptionLike} from "evg_observable/src/outLib/Types";
import {EState} from "./Env";
import {Collector} from "evg_observable/src/outLib/Collector";
import {Observable} from "evg_observable/src/outLib/Observable";

export class ReactionSensor implements ILifeCircle, IReaction, ISensor {
    private _collector: ICollector;
    private $before: IObserver<EState>;
    private $main: IObserver<EState>;
    private $after: IObserver<EState>;
    private _state: EState;

    constructor() {
        this._state = EState.INIT;
        this._collector = new Collector();
        this.$before = new Observable(this._state);
        this.$main = new Observable(this._state);
        this.$after = new Observable(this._state);
    }

    start(): void {
        if (this._state === EState.START) return;
        if (this._state === EState.PROCESS) return;
        if (this._state === EState.DESTROY) return;

        this._state = EState.START;
    }

    stop(): void {
        if (this._state === EState.DESTROY) return;
        this._state = EState.STOP;
    }

    destroy(): void {
        if (this._state === EState.DESTROY) return;
        this._state = EState.DESTROY;

        this._collector.destroy();
        this.$before.destroy();
        this.$main.destroy();
        this.$after.destroy();

        this._collector = <any>0;
        this.$before = <any>0;
        this.$main = <any>0;
        this.$after = <any>0;
    }

    detect(): void {
        if (this._state === EState.DESTROY) return;
        if (this._state === EState.STOP) return;

        this.$before.next(this._state);
        this.$main.next(this._state);
        this.$after.next(this._state);

        this._state = EState.PROCESS;
    }

    subscribeBefore(callback: IListener<EState>): ISubscriptionLike<EState> | undefined {
        if (this._state === EState.DESTROY) return;
        if (!callback) return;

        const subscriber = this.$before.subscribe(callback);
        subscriber && this._collector.collect(<any>subscriber);
        return subscriber;
    }

    subscribe(callback: IListener<EState>): ISubscriptionLike<EState> | undefined {
        if (this._state === EState.DESTROY) return;
        if (!callback) return;

        const subscriber = this.$main.subscribe(callback);
        subscriber && this._collector.collect(<any>subscriber);
        return subscriber;
    }

    subscribeAfter(callback: IListener<EState>): ISubscriptionLike<EState> | undefined {
        if (this._state === EState.DESTROY) return;
        if (!callback) return;

        const subscriber = this.$after.subscribe(callback);
        subscriber && this._collector.collect(<any>subscriber);
        return subscriber;
    }

    get collector(): ICollector | undefined {
        if (this._state === EState.DESTROY) return undefined;
        return this._collector;
    }

    get state(): EState {
        return this._state;
    }
}