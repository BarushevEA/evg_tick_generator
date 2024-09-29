"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIntervalOrdered = void 0;
const Env_1 = require("./Env");
const Utils_1 = require("./Utils");
const AbstractOrderedGenerator_1 = require("./AbstractOrderedGenerator");
class GIntervalOrdered extends AbstractOrderedGenerator_1.AbstractOrderedGenerator {
    id = 0;
    delay = 0;
    constructor() {
        super();
    }
    setInterval(delay) {
        if (this.isDestroyed())
            return (0, Utils_1.getNegative)(Env_1.EState.DESTROYED);
        if (this.id)
            return (0, Utils_1.getNegative)(Env_1.EState.STARTED);
        if (delay < 0)
            return (0, Utils_1.getNegative)(Env_1.ERROR.NEGATIVE_DELAY);
        this.delay = delay;
        this.state$.next(Env_1.EState.INIT);
        return (0, Utils_1.getPositive)(Env_1.EState.INIT);
    }
    startProcess() {
        this.id = setInterval(() => {
            this.state$.next(Env_1.EState.PROCESS);
        }, this.delay);
        this.state$.next(Env_1.EState.STARTED);
        return (0, Utils_1.getPositive)(Env_1.EState.STARTED);
    }
    stopProcess() {
        clearInterval(this.id);
        this.id = 0;
        this.state$.next(Env_1.EState.STOPPED);
        return (0, Utils_1.getPositive)(Env_1.EState.STOPPED);
    }
}
exports.GIntervalOrdered = GIntervalOrdered;
