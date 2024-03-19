"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GInterval = void 0;
const Env_1 = require("./Env");
const Utils_1 = require("./Utils");
const AbstractGenerator_1 = require("./AbstractGenerator");
class GInterval extends AbstractGenerator_1.AbstractGenerator {
    intervalId = 0;
    delay = 0;
    constructor() {
        super();
    }
    setInterval(delay) {
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
    startProcess() {
        this.intervalId = setInterval(() => {
            this.state$.next(Env_1.EState.PROCESS);
        }, this.delay);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.STARTED);
    }
    stopProcess() {
        clearInterval(this.intervalId);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.STOPPED);
    }
}
exports.GInterval = GInterval;
