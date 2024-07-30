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
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.DESTROYED);
        if (this.intervalId)
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.STARTED);
        if (delay < 0)
            return (0, Utils_1.getNegativeStatus)(Env_1.ERROR.NEGATIVE_DELAY);
        this.delay = delay;
        this.state$.next(Env_1.EState.INIT);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.INIT);
    }
    startProcess() {
        this.intervalId = setInterval(() => {
            this.state$.next(Env_1.EState.PROCESS);
        }, this.delay);
        this.state$.next(Env_1.EState.STARTED);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.STARTED);
    }
    stopProcess() {
        clearInterval(this.intervalId);
        this.intervalId = 0;
        this.state$.next(Env_1.EState.STOPPED);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.STOPPED);
    }
}
exports.GInterval = GInterval;
