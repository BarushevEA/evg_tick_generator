"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickGenerator = void 0;
const Observable_1 = require("evg_observable/src/outLib/Observable");
const Env_1 = require("./Env");
class TickGenerator {
    constructor() {
        this.init();
        this.start();
    }
    init() {
        this.animationFrameTimer = 0;
        this.observablesPool = [];
        this.observablesPool.push(this.state$ = new Observable_1.Observable(Env_1.EState.INIT), this.animationState$ = new Observable_1.Observable(Env_1.EState.INIT), this.animationFrame$ = new Observable_1.Observable(this.animationState), this.animationFrameAfter$ = new Observable_1.Observable(this.animationState), this.animationFrameBefore$ = new Observable_1.Observable(this.animationState), this.tickHandlerState$ = new Observable_1.Observable(Env_1.EState.INIT), this.tick10$ = new Observable_1.Observable(this.tickHandlerState), this.tick100$ = new Observable_1.Observable(this.tickHandlerState), this.tick500$ = new Observable_1.Observable(this.tickHandlerState), this.tick1000$ = new Observable_1.Observable(this.tickHandlerState));
        try {
            if (!requestAnimationFrame) {
                throw new Error("requestAnimationFrame not defined");
            }
        }
        catch (err) {
            this.animationState$.next(Env_1.EState.UNDEFINED);
        }
    }
    start() {
        this.state$.next(Env_1.EState.START);
        this.runAnimation();
        this.runTickHandler();
    }
    get state() {
        if (this.state$.isDestroyed)
            return Env_1.EState.DESTROY;
        return this.state$.getValue();
    }
    stateSubscribe(callback) {
        return this.state$.subscribe(callback);
    }
    destroy() {
        this.stopAnimation();
        this.stopTickHandler();
        this.state$.next(Env_1.EState.DESTROY);
        this.animationState$.next(Env_1.EState.DESTROY);
        this.tickHandlerState$.next(Env_1.EState.DESTROY);
        for (const observable of this.observablesPool) {
            observable.destroy();
        }
    }
    runAnimation() {
        if (this.animationState === Env_1.EState.UNDEFINED)
            return;
        if (this.state === Env_1.EState.DESTROY)
            return;
        this.animationFrameTimer = requestAnimationFrame(this.runAnimation.bind(this));
        if (this.animationState !== Env_1.EState.START)
            this.animationState$.next(Env_1.EState.START);
        this.animationFrameBefore$.next(this.animationState);
        this.animationFrame$.next(this.animationState);
        this.animationFrameAfter$.next(this.animationState);
    }
    stopAnimation() {
        if (this.animationState === Env_1.EState.UNDEFINED)
            return;
        if (this.animationState === Env_1.EState.DESTROY)
            return;
        cancelAnimationFrame(this.animationFrameTimer);
        this.animationFrameTimer = 0;
        this.animationState$.next(Env_1.EState.STOP);
    }
    get animationState() {
        if (this.animationState$.isDestroyed)
            return Env_1.EState.DESTROY;
        return this.animationState$.getValue();
    }
    animationBeforeSubscribe(callback) {
        return this.animationFrameBefore$.subscribe(callback);
    }
    animationSubscribe(callback) {
        return this.animationFrame$.subscribe(callback);
    }
    animationAfterSubscribe(callback) {
        return this.animationFrameAfter$.subscribe(callback);
    }
    animationStateSubscribe(callback) {
        return this.animationState$.subscribe(callback);
    }
    runTickHandler() {
        if (this.state === Env_1.EState.DESTROY)
            return;
        if (this.tickHandlerState === Env_1.EState.START)
            return;
        this.tickHandlerState$.next(Env_1.EState.START);
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
    stopTickHandler() {
        if (this.state === Env_1.EState.DESTROY)
            return;
        if (this.tickHandlerState === Env_1.EState.STOP)
            return;
        clearInterval(this.tickTimer10);
        clearInterval(this.tickTimer100);
        clearInterval(this.tickTimer500);
        clearInterval(this.tickTimer1000);
        this.tickTimer10 = 0;
        this.tickTimer100 = 0;
        this.tickTimer500 = 0;
        this.tickTimer1000 = 0;
        this.tickHandlerState$.next(Env_1.EState.STOP);
    }
    get tickHandlerState() {
        if (this.tickHandlerState$.isDestroyed)
            return Env_1.EState.DESTROY;
        return this.tickHandlerState$.getValue();
    }
    interval1000Subscribe(callback) {
        return this.tick1000$.subscribe(callback);
    }
    interval500Subscribe(callback) {
        return this.tick500$.subscribe(callback);
    }
    interval100Subscribe(callback) {
        return this.tick100$.subscribe(callback);
    }
    interval10Subscribe(callback) {
        return this.tick10$.subscribe(callback);
    }
    intervalCustom(callback, delay) {
        let counter = delay;
        return this.tick10$.subscribe((state) => {
            counter -= 10.45;
            if (counter < 0) {
                callback(state);
                counter = delay;
            }
        });
    }
    timeout(callback, delay) {
        let counter = delay;
        let subscription;
        subscription = this.tick10$.subscribe((state) => {
            counter -= 10.45;
            if (counter < 0) {
                callback(state);
                subscription.unsubscribe();
            }
        });
    }
}
exports.TickGenerator = TickGenerator;
