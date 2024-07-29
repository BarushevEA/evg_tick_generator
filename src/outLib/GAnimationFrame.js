"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAnimationFrame = void 0;
const Env_1 = require("./Env");
const Utils_1 = require("./Utils");
const AbstractGenerator_1 = require("./AbstractGenerator");
class GAnimationFrame extends AbstractGenerator_1.AbstractGenerator {
    rafId;
    fps;
    constructor() {
        super();
        this.fps = 60;
        this.rafId = null;
    }
    setFPS(num) {
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.DESTROYED);
        if (this.rafId)
            return (0, Utils_1.getNegativeStatus)(Env_1.EState.STARTED);
        if (num < 1)
            return (0, Utils_1.getNegativeStatus)(Env_1.ERROR.NEGATIVE_DELAY);
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
    startProcess() {
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
    stopProcess() {
        if (!this.rafId)
            return (0, Utils_1.getNegativeStatus)(Env_1.ERROR.NEGATIVE_DELAY);
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
        this.state$.next(Env_1.EState.STOPPED);
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.STOPPED);
    }
}
exports.GAnimationFrame = GAnimationFrame;
