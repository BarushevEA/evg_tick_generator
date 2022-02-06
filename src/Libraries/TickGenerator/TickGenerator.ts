import {ITickGenerator} from "./Types";
import {Observable} from "evg_observable/src/outLib/Observable";
import {EState} from "./Env";
import {ICallback, ISubscriptionLike} from "evg_observable/src/outLib/Types";

export class TickGenerator implements ITickGenerator {
    private state$: Observable<EState>;

    private animationFrame$: Observable<EState>;
    private animationFrameAfter$: Observable<EState>;
    private animationFrameBefore$: Observable<EState>;
    private animationState$: Observable<EState>;
    private animationFrameTimer: number;

    private observablesPool: Observable<any>[];

    constructor() {
        this.init();
        this.start();
    }

    private init(): void {
        this.animationFrameTimer = 0;
        this.observablesPool = [];
        this.observablesPool.push(
            this.state$ = new Observable<EState>(EState.INIT),
            this.animationState$ = new Observable<EState>(EState.INIT),
            this.animationFrame$ = new Observable<EState>(this.animationState),
            this.animationFrameAfter$ = new Observable<EState>(this.animationState),
            this.animationFrameBefore$ = new Observable<EState>(this.animationState),
        );
    }

    private start(): void {
        this.state$.next(EState.START);
        this.runAnimation();
    }

    runAnimation(): void {
        if (this.state != EState.DESTROY) {
            this.animationFrameTimer = requestAnimationFrame(this.runAnimation.bind(this));

            if (this.animationState !== EState.START) this.animationState$.next(EState.START);

            this.animationFrameBefore$.next(this.animationState);
            this.animationFrame$.next(this.animationState);
            this.animationFrameAfter$.next(this.animationState);
        }
    }

    stopAnimation(): void {
        cancelAnimationFrame(this.animationFrameTimer);
        this.animationFrameTimer = 0;
        this.animationState$.next(EState.STOP);
    }

    destroy(): void {
        this.stopAnimation();
        this.state$.next(EState.DESTROY);
        this.animationState$.next(EState.DESTROY);
        for (const observable of this.observablesPool) {
            observable.destroy();
        }
    }


    get state(): EState {
        if (this.state$.isDestroyed) return EState.DESTROY;

        return this.state$.getValue();
    }

    get animationState(): EState {
        if (this.animationState$.isDestroyed) return EState.DESTROY;

        return this.animationState$.getValue();
    }

    animationBeforeSubscribe(callback: ICallback<any>): ISubscriptionLike<any> {
        return this.animationFrameBefore$.subscribe(callback);
    }

    animationSubscribe(callback: ICallback<any>): ISubscriptionLike<any> {
        return this.animationFrame$.subscribe(callback);
    }

    animationAfterSubscribe(callback: ICallback<any>): ISubscriptionLike<any> {
        return this.animationFrameAfter$.subscribe(callback);
    }

    animationStateSubscribe(callback: ICallback<any>): ISubscriptionLike<any> {
        return this.animationState$.subscribe(callback);
    }

    stateSubscribe(callback: ICallback<any>): ISubscriptionLike<any> {
        return this.state$.subscribe(callback);
    }
}