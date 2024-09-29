"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GTimeout = void 0;
const Env_1 = require("./Env");
const Utils_1 = require("./Utils");
const AbstractGenerator_1 = require("./AbstractGenerator");
class GTimeout extends AbstractGenerator_1.AbstractGenerator {
    delay = 0;
    id = 0;
    constructor() {
        super();
    }
    setTimeout(delay) {
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
        this.id = setTimeout(() => {
            this.state$.next(Env_1.EState.PROCESS);
            this.state$.next(Env_1.EState.STOPPED);
        }, this.delay);
        this.state$.next(Env_1.EState.STARTED);
        return (0, Utils_1.getPositive)(Env_1.EState.STARTED);
    }
    stopProcess() {
        clearTimeout(this.id);
        this.id = 0;
        this.state$.next(Env_1.EState.STOPPED);
        return (0, Utils_1.getPositive)(Env_1.EState.STOPPED);
    }
}
exports.GTimeout = GTimeout;
