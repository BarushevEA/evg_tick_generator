"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickCounter = void 0;
const Env_1 = require("./Env");
const evg_observable_1 = require("evg_observable");
const Utils_1 = require("./Utils");
class TickCounter {
    subject;
    _state = Env_1.EState.UNDEFINED;
    defaultPeriodMs = 1000;
    periodMs = 0;
    timer;
    sum = 0;
    counter = 0;
    counter$ = new evg_observable_1.Observable(this.counter);
    subscriber;
    constructor(subject) {
        this.subject = subject;
        this.init();
    }
    init() {
        this._state = Env_1.EState.INIT;
        this.resetPeriod();
    }
    get state() {
        return this._state;
    }
    getTicksPerPeriod() {
        return this.counter;
    }
    getTicksSum() {
        return this.sum;
    }
    resetPeriod() {
        if (this.isDestroyed())
            (0, Utils_1.getNegativeStatus)(Env_1.ERROR.INSTANCE_DESTROYED);
        if (this.state === Env_1.EState.STARTED)
            (0, Utils_1.getNegativeStatus)(this.state);
        this.periodMs = this.defaultPeriodMs;
        return (0, Utils_1.getPositiveStatus)(this.state);
    }
    setPeriod(period) {
        if (this.isDestroyed())
            (0, Utils_1.getNegativeStatus)(Env_1.ERROR.INSTANCE_DESTROYED);
        if (this.state === Env_1.EState.STARTED)
            (0, Utils_1.getNegativeStatus)(this.state);
        if ((typeof period !== 'number') || (period < 0))
            return {
                isApplied: false,
                state: Env_1.ERROR.TYPE_INVALID
            };
        this.periodMs = period;
        return (0, Utils_1.getPositiveStatus)(this.state);
    }
    subscribe(callback) {
        if (this.isDestroyed())
            return undefined;
        return this.counter$.subscribe(callback);
    }
    start() {
        if (this.isDestroyed())
            (0, Utils_1.getNegativeStatus)(Env_1.ERROR.INSTANCE_DESTROYED);
        if (this.state === Env_1.EState.STARTED)
            (0, Utils_1.getNegativeStatus)(Env_1.EState.STARTED);
        let innerCounter = 0;
        this.subscriber = this.subject.subscribeOnProcess(() => {
            innerCounter++;
            this.sum++;
        });
        this.timer = setInterval(() => {
            this.counter = innerCounter;
            innerCounter = 0;
            this.counter$.next(this.counter);
            this._state = Env_1.EState.READY;
        }, this.periodMs);
        this._state = Env_1.EState.STARTED;
        return (0, Utils_1.getPositiveStatus)(this.state);
    }
    stop() {
        if (this.isDestroyed())
            (0, Utils_1.getNegativeStatus)(Env_1.ERROR.INSTANCE_DESTROYED);
        if (this.timer)
            clearInterval(this.timer);
        this.subscriber?.unsubscribe();
        this.counter = 0;
        this.sum = 0;
        this._state = Env_1.EState.STOPPED;
        return (0, Utils_1.getPositiveStatus)(this.state);
    }
    isDestroyed() {
        return this._state === Env_1.EState.DESTROYED;
    }
    destroy() {
        this.stop();
        this.counter$.destroy();
        this._state = Env_1.EState.DESTROYED;
        return (0, Utils_1.getPositiveStatus)(this.state);
    }
}
exports.TickCounter = TickCounter;
