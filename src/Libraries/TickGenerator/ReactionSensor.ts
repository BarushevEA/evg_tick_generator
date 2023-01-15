import {ILifeCircle, ISensor, ISubscription, IListenerWrapper} from "./Types";
import {ICollector, IListener, IObserver} from "evg_observable/src/outLib/Types";
import {EState} from "./Env";
import {Collector} from "evg_observable/src/outLib/Collector";
import {Observable} from "evg_observable/src/outLib/Observable";
import {ListenerWrapper} from "./ListenerWrapper";

export class ReactionSensor implements ILifeCircle, ISubscription, ISensor {
    private _collector: ICollector;
    private $main: IObserver<EState>;
    private _state: EState;

    constructor() {
        this._state = EState.INIT;
        this._collector = new Collector();
        this.$main = new Observable(this._state);
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
        this.$main.destroy();

        this._collector = <any>0;
        this.$main = <any>0;
    }

    detect(): void {
        if (this._state === EState.DESTROY) return;
        if (this._state === EState.STOP) return;

        this.$main.next(this._state);

        this._state = EState.PROCESS;
    }

    subscribe(callback: IListener<EState>): IListenerWrapper | undefined {
        if (this._state === EState.DESTROY) return;
        if (!callback) return;

        const wrapper = new ListenerWrapper(this.$main, callback);
        this._collector.collect(wrapper);

        return wrapper;
    }

    get collector(): ICollector | undefined {
        if (this._state === EState.DESTROY) return undefined;
        return this._collector;
    }

    get state(): EState {
        return this._state;
    }
}