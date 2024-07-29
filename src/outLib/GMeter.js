"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GMeter = void 0;
const Env_1 = require("./Env");
const GInterval_1 = require("./GInterval");
const Utils_1 = require("./Utils");
function updateMetricsPerSecond(metric) {
    const counter = metric._counter;
    metric.countOfUsesPerSecond = counter.seconds;
    metric.countOfUsesPerSecondMax = (0, Utils_1.getMaxNum)(metric.countOfUsesPerSecondMax, counter.seconds);
    metric.countOfUsesPerSecondMin = (0, Utils_1.getMinNumNotZero)(metric.countOfUsesPerSecondMin, counter.seconds);
    metric.countOfUsesPerSecondAvg = (0, Utils_1.getAvgNum)(metric.countOfUsesPerSecondAvg, counter.seconds);
}
function updateMetricsPerPerMinute(metric) {
    const counter = metric._counter;
    metric.countOfUsesPerMinute = counter.minutes;
    metric.countOfUsesPerMinuteMax = (0, Utils_1.getMaxNum)(metric.countOfUsesPerMinuteMax, counter.minutes);
    metric.countOfUsesPerMinuteMin = (0, Utils_1.getMinNumNotZero)(metric.countOfUsesPerMinuteMin, counter.minutes);
    metric.countOfUsesPerMinuteAvg = (0, Utils_1.getAvgNum)(metric.countOfUsesPerMinuteAvg, counter.minutes);
}
function updateMetricsPerHour(metric) {
    const counter = metric._counter;
    metric.countOfUsesPerHour = counter.hours;
    metric.countOfUsesPerHourMax = (0, Utils_1.getMaxNum)(metric.countOfUsesPerHourMax, counter.hours);
    metric.countOfUsesPerHourMin = (0, Utils_1.getMinNumNotZero)(metric.countOfUsesPerHourMin, counter.hours);
    metric.countOfUsesPerHourAvg = (0, Utils_1.getAvgNum)(metric.countOfUsesPerHourAvg, counter.hours);
}
function updateMetricsPerDay(metric) {
    const counter = metric._counter;
    metric.countOfUsesPerDay = counter.days;
    metric.countOfUsesPerDayMax = (0, Utils_1.getMaxNum)(metric.countOfUsesPerDayMax, counter.days);
    metric.countOfUsesPerDayMin = (0, Utils_1.getMinNumNotZero)(metric.countOfUsesPerDayMin, counter.days);
    metric.countOfUsesPerDayAvg = (0, Utils_1.getAvgNum)(metric.countOfUsesPerDayAvg, counter.days);
}
class GMeter {
    metrics;
    _state;
    perSecondTimer;
    perMinuteTimer;
    perHourTimer;
    perDayTimer;
    constructor() {
        this.metrics = {};
        this._state = Env_1.EState.STOPPED;
        this.perSecondTimer = new GInterval_1.GInterval();
        this.perSecondTimer.setInterval(1000);
        this.perMinuteTimer = new GInterval_1.GInterval();
        this.perMinuteTimer.setInterval(60 * 1000);
        this.perHourTimer = new GInterval_1.GInterval();
        this.perHourTimer.setInterval(60 * 60 * 1000);
        this.perDayTimer = new GInterval_1.GInterval();
        this.perDayTimer.setInterval(24 * 60 * 60 * 1000);
    }
    start() {
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.ERROR.INSTANCE_DESTROYED);
        this.perSecondTimer.start();
        this.perMinuteTimer.start();
        this.perHourTimer.start();
        this.perDayTimer.start();
        this._state = Env_1.EState.PROCESS;
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.PROCESS);
    }
    stop() {
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.ERROR.INSTANCE_DESTROYED);
        this.perSecondTimer.stop();
        this.perMinuteTimer.stop();
        this.perHourTimer.stop();
        this.perDayTimer.stop();
        for (const metricsKey in this.metrics) {
            const metric = this.metrics[metricsKey];
            metric._counter.days = 0;
            metric._counter.hours = 0;
            metric._counter.minutes = 0;
            metric._counter.seconds = 0;
        }
        this._state = Env_1.EState.STOPPED;
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.STOPPED);
    }
    destroy() {
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.ERROR.INSTANCE_DESTROYED);
        this.stop();
        this.clearFunc();
        this.perSecondTimer.destroy();
        this.perMinuteTimer.destroy();
        this.perHourTimer.destroy();
        this.perDayTimer.destroy();
        this._state = Env_1.EState.DESTROYED;
        return (0, Utils_1.getPositiveStatus)(Env_1.EState.DESTROYED);
    }
    isDestroyed() {
        return this._state === Env_1.EState.DESTROYED;
    }
    deleteFunc(funcName) {
        if (this.isDestroyed())
            return (0, Utils_1.getNegativeStatus)(Env_1.ERROR.INSTANCE_DESTROYED);
        if (funcName in this.metrics) {
            const metric = this.metrics[funcName];
            metric._deleteObj.isDeleted = true;
            // @ts-ignore
            metric._deleteObj = null;
            delete this.metrics[funcName];
            return (0, Utils_1.getPositiveStatus)(Env_1.EState.DELETED);
        }
        return (0, Utils_1.getNegativeStatus)(Env_1.ERROR.NAME_IS_NOT_PRESENT);
    }
    clearFunc() {
        const listForDelete = [];
        for (const funcName in this.metrics)
            listForDelete.push(funcName);
        for (const funcName of listForDelete)
            this.deleteFunc(funcName);
    }
    decorate(funcName, func) {
        const { deleteObj, metric } = this.createMetric(funcName);
        return (...args) => {
            if (deleteObj.isDeleted)
                return func(...args);
            const start = Date.now();
            metric.countOfUses++;
            metric._counter.seconds++;
            metric._counter.minutes++;
            metric._counter.hours++;
            metric._counter.days++;
            try {
                return func(...args);
            }
            catch (error) {
                if (!deleteObj.isDeleted)
                    metric.countOfErrors++;
                throw error;
            }
            finally {
                if (!deleteObj.isDeleted) {
                    metric.timePerCall = Date.now() - start;
                    metric.totalExecutionTime += metric.timePerCall;
                }
            }
        };
    }
    createMetric(funcName) {
        if (funcName in this.metrics)
            throw new Error(`A function with the name "${funcName}" is already decorated`);
        if (this.isDestroyed())
            throw new Error(Env_1.ERROR.INSTANCE_DESTROYED);
        const deleteObj = { isDeleted: false };
        const counter = {
            seconds: 0,
            minutes: 0,
            hours: 0,
            days: 0,
        };
        this.metrics[funcName] = {
            countOfUses: 0,
            countOfErrors: 0,
            totalExecutionTime: 0,
            timePerCall: 0,
            countOfUsesPerSecond: 0,
            countOfUsesPerMinute: 0,
            countOfUsesPerHour: 0,
            countOfUsesPerDay: 0,
            countOfUsesPerDayAvg: 0,
            countOfUsesPerDayMax: 0,
            countOfUsesPerDayMin: 0,
            countOfUsesPerHourAvg: 0,
            countOfUsesPerHourMax: 0,
            countOfUsesPerHourMin: 0,
            countOfUsesPerMinuteAvg: 0,
            countOfUsesPerMinuteMax: 0,
            countOfUsesPerMinuteMin: 0,
            countOfUsesPerSecondAvg: 0,
            countOfUsesPerSecondMax: 0,
            countOfUsesPerSecondMin: 0,
            _deleteObj: deleteObj,
            _counter: counter
        };
        const metric = this.metrics[funcName];
        this.addTimers(deleteObj, metric);
        return { deleteObj, metric };
    }
    decorateAsync(funcName, func) {
        const { deleteObj, metric } = this.createMetric(funcName);
        return async (...args) => {
            if (deleteObj.isDeleted)
                return await func(...args);
            const start = Date.now();
            metric.countOfUses++;
            metric._counter.seconds++;
            metric._counter.minutes++;
            metric._counter.hours++;
            metric._counter.days++;
            try {
                return await func(...args);
            }
            catch (error) {
                if (!deleteObj.isDeleted)
                    metric.countOfErrors++;
                throw error;
            }
            finally {
                if (!deleteObj.isDeleted) {
                    metric.timePerCall = Date.now() - start;
                    metric.totalExecutionTime += metric.timePerCall;
                }
            }
        };
    }
    addTimers(deleteObj, metric) {
        const counter = metric._counter;
        this.addTimer(deleteObj, this.perSecondTimer, () => {
            updateMetricsPerSecond(metric);
            updateMetricsPerPerMinute(metric);
            updateMetricsPerHour(metric);
            updateMetricsPerDay(metric);
            counter.seconds = 0;
        });
        this.addTimer(deleteObj, this.perMinuteTimer, () => {
            updateMetricsPerPerMinute(metric);
            updateMetricsPerHour(metric);
            updateMetricsPerDay(metric);
            counter.minutes = 0;
        });
        this.addTimer(deleteObj, this.perHourTimer, () => {
            updateMetricsPerHour(metric);
            updateMetricsPerDay(metric);
            counter.hours = 0;
        });
        this.addTimer(deleteObj, this.perDayTimer, () => {
            updateMetricsPerDay(metric);
            counter.days = 0;
        });
    }
    addTimer(deleteObj, timer, handler) {
        const subs = timer.subscribeOnProcess(() => {
            if (deleteObj.isDeleted) {
                subs?.unsubscribe();
                return;
            }
            handler();
        });
    }
    getMetrics(funcName) {
        const metrics = { ...this.metrics[funcName] };
        delete metrics._deleteObj;
        delete metrics._counter;
        return metrics;
    }
    getAll() {
        const userMetrics = {};
        for (const metricsKey in this.metrics) {
            userMetrics[metricsKey] = this.getMetrics(metricsKey);
        }
        return userMetrics;
    }
    get length() {
        return Object.keys(this.metrics).length;
    }
    get state() {
        return this._state;
    }
}
exports.GMeter = GMeter;
