import {IAnimation, ITickGenerator, ITickHandler, milliseconds} from "./Types";
import {Observable} from "evg_observable/src/outLib/Observable";
import {EState} from "./Env";
import {ICallback, ISubscriptionLike} from "evg_observable/src/outLib/Types";

export class TickGenerator implements ITickGenerator, IAnimation, ITickHandler {
    private state$: Observable<EState>;

    private animationFrame$: Observable<EState>;
    private animationFrameAfter$: Observable<EState>;
    private animationFrameBefore$: Observable<EState>;
    private animationState$: Observable<EState>;
    private animationFrameTimer: number;

    private tickHandlerState$: Observable<EState>;
    private tick10$: Observable<EState>;
    private tick100$: Observable<EState>;
    private tick500$: Observable<EState>;
    private tick1000$: Observable<EState>;
    private tickTimer10: any;
    private tickTimer100: any;
    private tickTimer500: any;
    private tickTimer1000: any;

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

            this.tickHandlerState$ = new Observable<EState>(EState.INIT),
            this.tick10$ = new Observable<EState>(this.tickHandlerState),
            this.tick100$ = new Observable<EState>(this.tickHandlerState),
            this.tick500$ = new Observable<EState>(this.tickHandlerState),
            this.tick1000$ = new Observable<EState>(this.tickHandlerState),
        );

        try {
            if (!requestAnimationFrame) {
                throw new Error("requestAnimationFrame not defined")
            }
        } catch (err) {
            this.animationState$.next(EState.UNDEFINED);
        }
    }

    private start(): void {
        this.state$.next(EState.START);
        this.runAnimation();
        this.runTickHandler();
    }

    get state(): EState {
        if (this.state$.isDestroyed) return EState.DESTROY;

        return this.state$.getValue();
    }

    stateSubscribe(callback: ICallback<any>): ISubscriptionLike<any> {
        return this.state$.subscribe(callback);
    }

    destroy(): void {
        this.stopAnimation();
        this.stopTickHandler();
        this.state$.next(EState.DESTROY);
        this.animationState$.next(EState.DESTROY);
        this.tickHandlerState$.next(EState.DESTROY);
        for (const observable of this.observablesPool) {
            observable.destroy();
        }
    }

    runAnimation(): void {
        if (this.animationState === EState.UNDEFINED) return;
        if (this.state === EState.DESTROY) return;

        this.animationFrameTimer = requestAnimationFrame(this.runAnimation.bind(this));

        if (this.animationState !== EState.START) this.animationState$.next(EState.START);

        this.animationFrameBefore$.next(this.animationState);
        this.animationFrame$.next(this.animationState);
        this.animationFrameAfter$.next(this.animationState);
    }

    stopAnimation(): void {
        if (this.animationState === EState.UNDEFINED) return;
        if (this.animationState === EState.DESTROY) return;

        cancelAnimationFrame(this.animationFrameTimer);
        this.animationFrameTimer = 0;
        this.animationState$.next(EState.STOP);
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

    runTickHandler(): void {
        if (this.state === EState.DESTROY) return;
        if (this.tickHandlerState === EState.START) return;

        this.tickHandlerState$.next(EState.START);

        this.tickTimer10 = setInterval(() => {
            this.tick10$.next(this.tickHandlerState);
        }, 10);

        this.tickTimer100 = setInterval(() => {
            this.tick100$.next(this.tickHandlerState);
        }, 100);

        this.tickTimer500 = setInterval(() => {
            this.tick500$.next(this.tickHandlerState);
        }, 500);

        this.tickTimer1000 = setInterval(() => {
            this.tick1000$.next(this.tickHandlerState);
        }, 1000);
    }

    stopTickHandler(): void {
        if (this.state === EState.DESTROY) return;
        if (this.tickHandlerState === EState.STOP) return;

        clearInterval(this.tickTimer10);
        clearInterval(this.tickTimer100);
        clearInterval(this.tickTimer500);
        clearInterval(this.tickTimer1000);

        this.tickTimer10 = 0;
        this.tickTimer100 = 0;
        this.tickTimer500 = 0;
        this.tickTimer1000 = 0;
        this.tickHandlerState$.next(EState.STOP);
    }

    get tickHandlerState(): EState {
        if (this.tickHandlerState$.isDestroyed) return EState.DESTROY;

        return this.tickHandlerState$.getValue();
    }

    interval1000Subscribe(callback: ICallback<any>): ISubscriptionLike<any> {
        return this.tick1000$.subscribe(callback);
    }

    interval500Subscribe(callback: ICallback<any>): ISubscriptionLike<any> {
        return this.tick500$.subscribe(callback);
    }

    interval100Subscribe(callback: ICallback<any>): ISubscriptionLike<any> {
        return this.tick100$.subscribe(callback);
    }

    interval10Subscribe(callback: ICallback<any>): ISubscriptionLike<any> {
        return this.tick10$.subscribe(callback);
    }

    intervalCustom(callback: ICallback<any>, delay: milliseconds): ISubscriptionLike<any> {
        let counter = delay;

        return this.tick10$.subscribe((state) => {
            counter -= 10.45;
            if (counter < 0) {
                callback(state);
                counter = delay;
            }
        });
    }
}