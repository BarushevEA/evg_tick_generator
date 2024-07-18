"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GTimeoutOrdered = void 0;
const Env_1 = require("./Env");
const Utils_1 = require("./Utils");
const AbstractOrderedGenerator_1 = require("./AbstractOrderedGenerator");
class GTimeoutOrdered extends AbstractOrderedGenerator_1.AbstractOrderedGenerator {
    delay = 0;
    timerId = 0;
    constructor() {
        super();
    }
    setTimeout(delay) {
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.DESTROYED);
        if (this.timerId)
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.STARTED);
        if (delay < 0)
            return (0, Utils_1.getNegativeStatus)(Env_1.ERROR.NEGATIVE_DELAY);
        this.delay = delay;
        this.state$.next(Env_1.EState.INIT);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.INIT);
    }
    startProcess() {
        this.timerId = setTimeout(() => {
            this.state$.next(Env_1.EState.PROCESS);
            this.state$.next(Env_1.EState.STOPPED);
        }, this.delay);
        this.state$.next(Env_1.EState.STARTED);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.STARTED);
    }
    stopProcess() {
        clearTimeout(this.timerId);
        this.timerId = 0;
        this.state$.next(Env_1.EState.STOPPED);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.STOPPED);
    }
}
exports.GTimeoutOrdered = GTimeoutOrdered;
