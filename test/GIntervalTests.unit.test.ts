import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {EState} from "../src/Libraries/TickGenerator/Env";
import {Status} from "../src/Libraries/TickGenerator/Types";
import {GInterval} from "../src/Libraries/TickGenerator/GInterval";

_chai.should();
_chai.expect;

@suite
class GIntervalTestsUnitTests {
    private INTERVAL: GInterval;

    before() {
        this.INTERVAL = new GInterval();
    }

    @test "State is initially undefined"() {
        expect(this.INTERVAL.state).to.equal(EState.UNDEFINED);
        // @ts-ignore
        this.INTERVAL.state$.next(undefined);
        expect(this.INTERVAL.state).to.equal(EState.UNDEFINED);
    }

    @test "Destroy method should change state to DESTROYED"() {
        const destroyResult: Status = this.INTERVAL.destroy();
        expect(destroyResult.isApplied).to.be.true;
        expect(this.INTERVAL.state).to.equal(EState.DESTROYED);
    }

    @test "SetTimeout method should work correctly"() {
        // check with negative delay
        expect(this.INTERVAL.setInterval(-1).isApplied).to.be.false;
        // proper delay, expect a positive status and INIT state
        expect(this.INTERVAL.setInterval(3000).isApplied).to.be.true;
        expect(this.INTERVAL.state).to.equal(EState.INIT);
        this.INTERVAL.start();
        expect(this.INTERVAL.setInterval(3000).isApplied).to.be.false;
        this.INTERVAL.destroy();
        expect(this.INTERVAL.setInterval(3000).isApplied).to.be.false;
    }

    @test "Start method should change state to STARTED"() {
        this.INTERVAL.setInterval(1000);
        this.INTERVAL.start();
        expect(this.INTERVAL.state).to.equal(EState.STARTED);
        this.INTERVAL.destroy();
        expect(this.INTERVAL.start().isApplied).to.be.false;
    }

    @test "Start method should be EState.PROCESS and EState.STOPPED"() {
        let count = 0;
        this.INTERVAL.setInterval(1);
        this.INTERVAL.subscribeOnState(state => {
            count++;
            if (count === 1) expect(state).to.equal(EState.STARTED);
            if (count === 2) expect(state).to.equal(EState.PROCESS);
            if (count === 3) expect(state).to.equal(EState.PROCESS);
            if (count === 4) expect(state).to.equal(EState.PROCESS);
            if (count === 4) this.INTERVAL.stop();
            if (count > 4 && state === EState.STOPPED) {
                console.log("==============> EState.STOPPED, count:", count);
                expect(count > 4).to.be.true;
            }
        });
        this.INTERVAL.start();
    }

    @test "Stop method should change state to STOPPED"() {
        this.INTERVAL.setInterval(5000);
        this.INTERVAL.start();
        this.INTERVAL.stop();
        expect(this.INTERVAL.state).to.equal(EState.STOPPED);
        this.INTERVAL.destroy();
        expect(this.INTERVAL.stop().isApplied).to.be.false;
    }

    @test "IsDestroyed method should return correct state"() {
        expect(this.INTERVAL.isDestroyed()).to.be.false;
        this.INTERVAL.destroy();
        expect(this.INTERVAL.isDestroyed()).to.be.true;
    }

    @test "SubscribeOnState method should return correct response"() {
        const subs = this.INTERVAL.subscribeOnState(() => true);
        expect(!!subs.unsubscribe).to.be.true;
        this.INTERVAL.destroy();
        expect(this.INTERVAL.subscribeOnState(() => true)).to.be.undefined
    }

    @test "SubscribeOnProcess method should return correct response"() {
        const subs = this.INTERVAL.subscribeOnProcess(() => true);
        expect(!!subs.unsubscribe).to.be.true;
        this.INTERVAL.destroy();
        expect(this.INTERVAL.subscribeOnProcess(() => true)).to.be.undefined
    }
}
