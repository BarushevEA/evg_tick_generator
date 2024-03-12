import {expect} from 'chai';
import {EState} from "../src/Libraries/TickGenerator/Env";
import {GAnimationFrame} from "../src/Libraries/TickGenerator/GAnimationFrame";
import {Status} from "../src/Libraries/TickGenerator/Types";
import * as sinon from 'sinon';

describe('GAnimationFrameUnitTests', () => {
    let RAF: GAnimationFrame;
    let clock: sinon.SinonFakeTimers;
    let rafId = 0;
    let now = 0;

    before(() => {
        clock = sinon.useFakeTimers();

        global.requestAnimationFrame = (cb: FrameRequestCallback) => {
            rafId = setTimeout(() => {
                cb(now);
            }, 1000 / 60) as any;
            return rafId;
        }

        global.cancelAnimationFrame = (id: number) => {
            clearTimeout(id);
            rafId = 0;
        };

        (<any>global).performance = {
            now: () => {
                return now;
            }
        }

        setInterval(() => {
            now += 1000 / 60;
        }, 1000 / 60);
    });

    beforeEach(() => {
        RAF = new GAnimationFrame();
    });

    after(() => {
        clock.restore();
    });

    it("State is initially undefined", () => {
        expect(RAF.state).to.equal(EState.UNDEFINED);
    });

    it("Destroy method should change state to DESTROYED", () => {
        const destroyResult: Status = RAF.destroy();
        expect(destroyResult.isApplied).to.be.true;
        expect(RAF.state).to.equal(EState.DESTROYED);
    });

    it("SetFPS method should work correctly", () => {
        // check with negative fps value
        expect(RAF.setFPS(-1).isApplied).to.be.false;
        // proper delay, expect a positive status and UNDEFINED state
        expect(RAF.setFPS(30).isApplied).to.be.true;
        expect(RAF.state).to.equal(EState.UNDEFINED);
        RAF.start();
        expect(RAF.setFPS(30).isApplied).to.be.false;
        RAF.destroy();
        expect(RAF.setFPS(30).isApplied).to.be.false;
    });

    it("Start method should change state to STARTED", () => {
        RAF.setFPS(30);
        RAF.start();
        expect(RAF.state).to.equal(EState.STARTED);
        RAF.destroy();
        expect(RAF.start().isApplied).to.be.false;
    });

    it("Stop method should change state to STOPPED", () => {
        RAF.setFPS(30);
        RAF.start();
        RAF.stop();
        expect(RAF.state).to.equal(EState.STOPPED);
        RAF.destroy();
        expect(RAF.stop().isApplied).to.be.false;
    });

    it("IsDestroyed method should return correct state", () => {
        expect(RAF.isDestroyed()).to.be.false;
        RAF.destroy();
        expect(RAF.isDestroyed()).to.be.true;
    });

    it("SubscribeOnState method should return correct response", () => {
        const subs = RAF.subscribeOnState(() => true);
        expect(!!subs.unsubscribe).to.be.true;
        RAF.destroy();
        expect(RAF.subscribeOnState(() => true)).to.be.undefined;
    });

    it("SubscribeOnProcess method should return correct response", () => {
        const subs = RAF.subscribeOnProcess(() => true);
        expect(!!subs.unsubscribe).to.be.true;
        RAF.destroy();
        expect(RAF.subscribeOnProcess(() => true)).to.be.undefined;
    });
});
