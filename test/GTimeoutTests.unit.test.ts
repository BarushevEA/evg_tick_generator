import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {EState} from "../src/Libraries/TickGenerator/Env";
import {GTimeout} from "../src/Libraries/TickGenerator/GTimeout";
import {Status} from "../src/Libraries/TickGenerator/Types";

_chai.should();
_chai.expect;

@suite
class GTimeoutTests {
    private TIMEOUT: GTimeout;

    before() {
        this.TIMEOUT = new GTimeout();
    }

    @test "State is initially undefined"() {
        expect(this.TIMEOUT.state).to.equal(EState.UNDEFINED);
        // @ts-ignore
        this.TIMEOUT.state$.next(undefined);
        expect(this.TIMEOUT.state).to.equal(EState.UNDEFINED);
    }

    @test "Destroy method should change state to DESTROYED"() {
        const destroyResult: Status = this.TIMEOUT.destroy();
        expect(destroyResult.isApplied).to.be.true;
        expect(this.TIMEOUT.state).to.equal(EState.DESTROYED);
    }

    @test "SetTimeout method should work correctly"() {
        // check with negative delay
        expect(this.TIMEOUT.setTimeout(-1).isApplied).to.be.false;
        // proper delay, expect a positive status and INIT state
        expect(this.TIMEOUT.setTimeout(3000).isApplied).to.be.true;
        expect(this.TIMEOUT.state).to.equal(EState.INIT);
        this.TIMEOUT.start();
        expect(this.TIMEOUT.setTimeout(3000).isApplied).to.be.false;
        this.TIMEOUT.destroy();
        expect(this.TIMEOUT.setTimeout(3000).isApplied).to.be.false;
    }

    @test "Start method should change state to STARTED"() {
        this.TIMEOUT.setTimeout(1000);
        this.TIMEOUT.start();
        expect(this.TIMEOUT.state).to.equal(EState.STARTED);
        this.TIMEOUT.destroy();
        expect(this.TIMEOUT.start().isApplied).to.be.false;
    }

    @test "Start method should be EState.PROCESS and EState.STOPPED"() {
        let count = 0;
        this.TIMEOUT.setTimeout(1);
        this.TIMEOUT.subscribeOnState(state => {
            count++;
            if (count === 1) expect(state).to.equal(EState.STARTED);
            if (count === 2) expect(state).to.equal(EState.PROCESS);
            if (count === 3) expect(state).to.equal(EState.STOPPED);
        });
        this.TIMEOUT.start();
    }

    @test "Stop method should change state to STOPPED"() {
        this.TIMEOUT.setTimeout(5000);
        this.TIMEOUT.start();
        this.TIMEOUT.stop();
        expect(this.TIMEOUT.state).to.equal(EState.STOPPED);
        this.TIMEOUT.destroy();
        expect(this.TIMEOUT.stop().isApplied).to.be.false;
    }

    @test "IsDestroyed method should return correct state"() {
        expect(this.TIMEOUT.isDestroyed()).to.be.false;
        this.TIMEOUT.destroy();
        expect(this.TIMEOUT.isDestroyed()).to.be.true;
    }

    @test "SubscribeOnState method should return correct response"() {
        const subs = this.TIMEOUT.subscribeOnState(() => true);
        expect(!!subs.unsubscribe).to.be.true;
        this.TIMEOUT.destroy();
        expect(this.TIMEOUT.subscribeOnState(() => true)).to.be.undefined
    }

    @test "SubscribeOnProcess method should return correct response"() {
        const subs = this.TIMEOUT.subscribeOnProcess(() => true);
        expect(!!subs.unsubscribe).to.be.true;
        this.TIMEOUT.destroy();
        expect(this.TIMEOUT.subscribeOnProcess(() => true)).to.be.undefined
    }
}
