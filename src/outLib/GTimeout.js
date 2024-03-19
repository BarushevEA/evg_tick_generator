"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GTimeout = void 0;
const Env_1 = require("./Env");
const Observable_1 = require("evg_observable/src/outLib/Observable");
const Utils_1 = require("./Utils");
class GTimeout {
    state$ = new Observable_1.Observable(Env_1.EState.UNDEFINED);
    delay = 0;
    timerId = 0;
    get state() {
        if (this.state$.isDestroyed)
            return Env_1.EState.DESTROYED;
        const state = this.state$.getValue();
        return state ?? Env_1.EState.UNDEFINED;
    }
    destroy() {
        this.stop();
        this.state$.next(Env_1.EState.DESTROYED);
        this.state$.destroy();
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.DESTROYED);
    }
    setTimeout(delay) {
        const state = this.state;
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.DESTROYED);
        if (state === Env_1.EState.STARTED)
            return (0, Utils_1.getNegativeStatus)(state);
        if (delay < 0)
            return (0, Utils_1.getNegativeStatus)(Env_1.ERROR.ERROR_NEGATIVE_DELAY);
        this.delay = delay;
        this.state$.next(Env_1.EState.INIT);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.INIT);
    }
    start() {
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.DESTROYED);
        this.timerId = setTimeout(() => {
            this.state$.next(Env_1.EState.PROCESS);
            this.state$.next(Env_1.EState.STOPPED);
        }, this.delay);
        this.state$.next(Env_1.EState.STARTED);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.STARTED);
    }
    stop() {
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.DESTROYED);
        clearTimeout(this.timerId);
        this.state$.next(Env_1.EState.STOPPED);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.STOPPED);
    }
    subscribeOnState(callback) {
        if (this.isDestroyed())
            return undefined;
        return this.state$.subscribe(callback);
    }
    subscribeOnProcess(callback) {
        if (this.isDestroyed())
            return undefined;
        return this.state$.pipe()?.emitByPositive(state => state === Env_1.EState.PROCESS).subscribe(callback);
    }
    isDestroyed() {
        return this.state === Env_1.EState.DESTROYED;
    }
}
exports.GTimeout = GTimeout;
