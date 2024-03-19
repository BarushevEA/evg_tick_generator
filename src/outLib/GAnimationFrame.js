"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAnimationFrame = void 0;
const Env_1 = require("./Env");
const Observable_1 = require("evg_observable/src/outLib/Observable");
const Utils_1 = require("./Utils");
class GAnimationFrame {
    rafId = null;
    fps = 60;
    state$ = new Observable_1.Observable(Env_1.EState.UNDEFINED);
    get state() {
        if (this.state$.isDestroyed)
            return Env_1.EState.DESTROYED;
        const state = this.state$.getValue();
        return state ?? Env_1.EState.UNDEFINED;
    }
    setFPS(num) {
        const state = this.state;
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.DESTROYED);
        if (state === Env_1.EState.STARTED)
            return (0, Utils_1.getNegativeStatus)(state);
        if (num < 1)
            return (0, Utils_1.getNegativeStatus)(Env_1.ERROR.ERROR_NEGATIVE_DELAY);
        this.fps = num;
        return (0, Utils_1.getPositiveStatus)(this.state);
    }
    set60fps() {
        return this.setFPS(60);
    }
    set30fps() {
        return this.setFPS(30);
    }
    setDefault() {
        return this.setFPS(60);
    }
    start() {
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.DESTROYED);
        if (this.rafId)
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.STARTED);
        let lastUpdate = Math.floor(performance.now());
        const frameInterval = Math.floor(1000 / this.fps);
        const animateFrame = (currentTimestamp) => {
            currentTimestamp = Math.floor(currentTimestamp);
            this.rafId = requestAnimationFrame(animateFrame);
            const timeElapsed = currentTimestamp - lastUpdate;
            if (timeElapsed >= frameInterval) {
                lastUpdate = currentTimestamp - (timeElapsed % frameInterval);
                this.state$.next(Env_1.EState.PROCESS);
            }
        };
        this.rafId = requestAnimationFrame(animateFrame);
        this.state$.next(Env_1.EState.STARTED);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.STARTED);
    }
    stop() {
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.DESTROYED);
        if (!this.rafId)
            return (0, Utils_1.getNegativeStatus)(Env_1.ERROR.ERROR_NEGATIVE_DELAY);
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
        this.state$.next(Env_1.EState.STOPPED);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.STOPPED);
    }
    destroy() {
        this.stop();
        this.state$.next(Env_1.EState.DESTROYED);
        this.state$.destroy();
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.DESTROYED);
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
exports.GAnimationFrame = GAnimationFrame;
