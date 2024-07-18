"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractOrderedGenerator = void 0;
const AbstractGenerator_1 = require("./AbstractGenerator");
const OrderedObservable_1 = require("evg_observable/src/outLib/OrderedObservable");
const Env_1 = require("./Env");
class AbstractOrderedGenerator extends AbstractGenerator_1.AbstractGenerator {
    state$ = new OrderedObservable_1.OrderedObservable(Env_1.EState.UNDEFINED);
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
}
exports.AbstractOrderedGenerator = AbstractOrderedGenerator;
