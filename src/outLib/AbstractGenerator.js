"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractGenerator = void 0;
const Observable_1 = require("evg_observable/src/outLib/Observable");
const Env_1 = require("./Env");
const Utils_1 = require("./Utils");
class AbstractGenerator {
    state$ = new Observable_1.Observable(Env_1.EState.UNDEFINED);
    get state() {
        if (this.state$.isDestroyed)
            return Env_1.EState.DESTROYED;
        const state = this.state$.getValue();
        return state ?? Env_1.EState.UNDEFINED;
    }
    start() {
        if (this.isDestroyed())
            return (0, Utils_1.getNegative)(Env_1.EState.DESTROYED);
        const status = this.startProcess();
        if (!status.isApplied)
            return status;
        return (0, Utils_1.getPositive)(status.state);
    }
    stop() {
        if (this.isDestroyed())
            return (0, Utils_1.getNegative)(Env_1.EState.DESTROYED);
        const status = this.stopProcess();
        if (!status.isApplied)
            return status;
        return (0, Utils_1.getPositive)(status.state);
    }
    destroy() {
        this.stop();
        this.state$.next(Env_1.EState.DESTROYED);
        this.state$.destroy();
        return (0, Utils_1.getPositive)(Env_1.EState.DESTROYED);
    }
    subscribeOnState(callback) {
        if (this.isDestroyed())
            return undefined;
        return this.state$.subscribe(callback);
    }
    subscribeOnProcess(callback) {
        if (this.isDestroyed())
            return undefined;
        return this.state$.pipe()?.refine(state => state === Env_1.EState.PROCESS).subscribe(callback);
    }
    isDestroyed() {
        return this.state === Env_1.EState.DESTROYED;
    }
}
exports.AbstractGenerator = AbstractGenerator;
