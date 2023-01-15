import {IInterval, ILifeCircle, IListenerWrapper, ISubscription, ms} from "./Types";
import {EState} from "./Env";
import {ReactionSensor} from "./ReactionSensor";
import {ICollector, IListener} from "evg_observable/src/outLib/Types";

export class ReactionInterval implements ILifeCircle, ISubscription, IInterval {
    private _state: EState;
    private reaction: ReactionSensor;
    private time: ms;
    private timerId: any;

    constructor() {
        this._state = EState.INIT;
        this.reaction = new ReactionSensor();
        this.time = 0;
    }

    start(): void {
        if (this._state === EState.START) return;
        if (this._state === EState.PROCESS) return;
        if (this._state === EState.DESTROY) return;

        this._state = EState.START;
        this.reaction.start();

        this.timerId = setInterval(() => {
            this._state = EState.PROCESS;
            this.reaction.detect();
        }, this.time);
    }

    stop(): void {
        if (this._state === EState.DESTROY) return;
        this._state = EState.STOP;
        this.reaction.stop();

        clearInterval(this.timerId);
    }

    destroy(): void {
        if (this._state === EState.DESTROY) return;
        this._state = EState.DESTROY;

        this.reaction.destroy();
        this.reaction = <any>0;
        this.time = 0;
        this.timerId = 0;
    }

    setInterval(time: ms): void {
        if (this._state === EState.START) return;
        if (this._state === EState.PROCESS) return;
        if (this._state === EState.DESTROY) return;

        this.time = time;
    }

    subscribe(callback: IListener<EState>): IListenerWrapper | undefined {
        if (this._state === EState.DESTROY) return;

        return this.reaction.subscribe(callback);
    }

    get collector(): ICollector | undefined {
        if (this._state === EState.DESTROY) return undefined;
        return this.reaction.collector;
    }

    get state(): EState {
        return this._state;
    }
}