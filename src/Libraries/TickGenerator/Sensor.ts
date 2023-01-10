import {ILifeCircle, ISensor, IReaction} from "./Types";
import {ICollector, IListener, IObserver, ISubscriptionLike} from "evg_observable/src/outLib/Types";
import {EState} from "./Env";
import {Collector} from "evg_observable/src/outLib/Collector";
import {Observable} from "evg_observable/src/outLib/Observable";

export class Sensor implements ILifeCircle, ISensor, IReaction {
    private readonly _collector: ICollector;
    private readonly $beforeTickObservable: IObserver<EState>;
    private readonly $tickObservable: IObserver<EState>;
    private readonly $afterTickObservable: IObserver<EState>;
    private state: EState;

    constructor() {
        this.state = EState.INIT;
        this._collector = new Collector();
        this.$beforeTickObservable = new Observable(this.state);
        this.$tickObservable = new Observable(this.state);
        this.$afterTickObservable = new Observable(this.state);
    }

    start(): void {
        if (this.state === EState.DESTROY) return;
        if (this.state === EState.START) return;
        if (this.state === EState.PROCESS) return;

        this.state = EState.START;
    }

    stop(): void {
        if (this.state === EState.DESTROY) return;
        this.state = EState.STOP;
    }

    destroy(): void {
        if (this.state === EState.DESTROY) return;
        this._collector.destroy();
        this.$beforeTickObservable.destroy();
        this.$tickObservable.destroy();
        this.$afterTickObservable.destroy();
        this.state = EState.DESTROY;
    }

    detect(): void {
        if (this.state === EState.DESTROY) return;
        if (this.state === EState.STOP) return;

        this.$beforeTickObservable.next(this.state);
        this.$tickObservable.next(this.state);
        this.$afterTickObservable.next(this.state);

        this.state = EState.PROCESS;
    }

    subscribeBefore(callback: IListener<EState>): ISubscriptionLike<EState> | undefined {
        if (this.state === EState.DESTROY) return;
        if (!callback) return;

        const subscriber = this.$beforeTickObservable.subscribe(callback);
        subscriber && this._collector.collect(<any>subscriber);
        return subscriber;
    }

    subscribeMain(callback: IListener<EState>): ISubscriptionLike<EState> | undefined {
        if (this.state === EState.DESTROY) return;
        if (!callback) return;

        const subscriber = this.$tickObservable.subscribe(callback);
        subscriber && this._collector.collect(<any>subscriber);
        return subscriber;
    }

    subscribeAfter(callback: IListener<EState>): ISubscriptionLike<EState> | undefined {
        if (this.state === EState.DESTROY) return;
        if (!callback) return;

        const subscriber = this.$afterTickObservable.subscribe(callback);
        subscriber && this._collector.collect(<any>subscriber);
        return subscriber;
    }

    get collector(): ICollector {
        return this._collector;
    }
}