import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {TickGenerator} from "../src/Libraries/TickGenerator/TickGenerator";
import {EState} from "../src/Libraries/TickGenerator/Env";
import {ISubscriptionLike} from "evg_observable/src/outLib/Types";

_chai.should();
_chai.expect;

@suite
class TickGeneratorUnitTest {
    private GENERATOR: TickGenerator

    before() {
        globalThis.requestAnimationFrame = (fn: Function) => 10;
        globalThis.cancelAnimationFrame = (timer: number) => true;
        this.GENERATOR = new TickGenerator();
    }

    @test 'is created'() {
        const generator = this.GENERATOR;

        // @ts-ignore
        for (const observable of generator.observablesPool) {
            expect(false).to.be.equal(observable.isDestroyed);
        }

        generator.destroy();
    }

    @test 'is destroyed'() {
        const generator = this.GENERATOR;

        generator.stateSubscribe((state: EState) => {
            expect(EState.DESTROY).to.be.equal(state);
        })

        generator.destroy();
        expect(EState.DESTROY).to.be.equal(generator.state);
    }

    @test 'runAnimation()'() {
        const generator = this.GENERATOR;
        let subscription1: ISubscriptionLike<any>;

        generator.stopAnimation();
        subscription1 = generator.animationStateSubscribe((state: EState) => {
            expect(EState.START).to.be.equal(state);
            subscription1.unsubscribe();
            generator.destroy();
        });

        generator.runAnimation();
    }

    @test 'runAnimation() after destroy'() {
        const generator = this.GENERATOR;
        generator.destroy();
        generator.animationStateSubscribe(() => expect(EState.DESTROY).to.be.equal(EState.START));
        generator.runAnimation()

        expect(EState.DESTROY).to.be.equal(generator.state);
        expect(EState.DESTROY).to.be.equal(generator.animationState);
    }

    @test 'stopAnimationFrame()'() {
        const generator = this.GENERATOR;
        let subscription1: ISubscriptionLike<any>;

        subscription1 = generator.animationStateSubscribe((state: EState) => {
            expect(EState.STOP).to.be.equal(state);
            subscription1.unsubscribe();
            generator.destroy();
        })

        generator.stopAnimation();
    }

    @test 'stopAnimationFrame() by destroy'() {
        const generator = this.GENERATOR;

        generator.destroy();
        generator.stopAnimation();

        expect(EState.DESTROY).to.be.equal(generator.animationState);
    }

    @test 'animationSubscribe(callback: ICallback<any>)'() {
        const generator = this.GENERATOR;
        let counter = 0;
        let subscription1: ISubscriptionLike<any>;
        const listener = () => counter++;
        generator.stopAnimation();
        subscription1 = generator.animationSubscribe(listener);
        generator.runAnimation();
        expect(1).to.be.equal(counter);
        subscription1.unsubscribe();
        generator.destroy();
    }

    @test 'animationBeforeSubscribe(callback: ICallback<any>)'() {
        const generator = this.GENERATOR;
        let counterBefore = 0;
        let counterGeneral = 0;
        let subscription1: ISubscriptionLike<any>;
        let subscription2: ISubscriptionLike<any>;
        const listenerBefore = () => counterBefore++;
        const listenerGeneral = () => counterGeneral = counterGeneral + counterBefore;
        generator.stopAnimation();
        subscription1 = generator.animationBeforeSubscribe(listenerBefore);
        subscription2 = generator.animationSubscribe(listenerGeneral);
        generator.runAnimation();
        expect(1).to.be.equal(counterGeneral);
        subscription1.unsubscribe();
        subscription2.unsubscribe();
        generator.destroy();
    }

    @test 'animationAfterSubscribe(callback: ICallback<any>)'() {
        const generator = this.GENERATOR;
        let counterAfter = 0;
        let counterGeneral = 0;
        let subscription1: ISubscriptionLike<any>;
        let subscription2: ISubscriptionLike<any>;
        const listenerAfter = () => counterAfter = counterAfter + counterGeneral;
        const listenerGeneral = () => counterGeneral++;
        generator.stopAnimation();
        subscription1 = generator.animationAfterSubscribe(listenerAfter);
        subscription2 = generator.animationSubscribe(listenerGeneral);
        generator.runAnimation();

        expect(1).to.be.equal(counterAfter);
        subscription1.unsubscribe();
        subscription2.unsubscribe();
        generator.destroy();
    }

    @test 'animationStateSubscribe(callback: ICallback<any>) on start'() {
        const generator = this.GENERATOR;
        generator.stopAnimation();
        expect(EState.STOP).to.be.equal(generator.animationState);

        let subscription: ISubscriptionLike<any>;
        const listener = (state: EState) => {
            expect(EState.START).to.be.equal(state);
            subscription.unsubscribe();
        };
        subscription = generator.animationStateSubscribe(listener);
        generator.runAnimation();

        expect(EState.START).to.be.equal(generator.animationState);
        generator.destroy();
    }

    @test 'animationStateSubscribe(callback: ICallback<any>) on multi start'() {
        const generator = this.GENERATOR;
        let counter = 0;
        generator.stopAnimation();
        expect(EState.STOP).to.be.equal(generator.animationState);

        let subscription: ISubscriptionLike<any>;
        const listener = (state: EState) => {
            expect(EState.START).to.be.equal(state);
            counter++;
        }
        subscription = generator.animationStateSubscribe(listener);
        generator.runAnimation();
        generator.runAnimation();
        generator.runAnimation();

        expect(EState.START).to.be.equal(generator.animationState);
        expect(1).to.be.equal(counter);
        subscription.unsubscribe();
        generator.destroy();
    }

    @test 'requestAnimationFrame undefined'() {
        globalThis.requestAnimationFrame = undefined;
        const generator = new TickGenerator();
        expect(EState.UNDEFINED).to.be.equal(generator.animationState);

        generator.stopAnimation();
        expect(EState.UNDEFINED).to.be.equal(generator.animationState);

        generator.destroy();
        expect(EState.DESTROY).to.be.equal(generator.animationState);
        this.GENERATOR.destroy();
    }

    @test 'stopTickHandler'() {
        const generator = this.GENERATOR;
        generator.stopTickHandler();
        expect(EState.STOP).to.be.equal(generator.tickHandlerState);
        generator.destroy();
    }

    @test 'interval1000Subscribe'() {
        const generator = this.GENERATOR;
        let start = Date.now();
        generator.interval1000Subscribe(() => {
            const stop = Date.now();
            const delay = stop - start;
            expect(true).to.be.equal(delay > 995 && delay < 1005);
            generator.destroy();
        });
    }

    @test 'interval500Subscribe'() {
        const generator = this.GENERATOR;
        let start = Date.now();
        generator.interval500Subscribe(() => {
            const stop = Date.now();
            const delay = stop - start;
            expect(true).to.be.equal(delay > 495 && delay < 505);
            generator.destroy();
        });
    }

    @test 'interval100Subscribe'() {
        const generator = this.GENERATOR;
        let start = Date.now();
        generator.interval100Subscribe(() => {
            const stop = Date.now();
            const delay = stop - start;
            expect(true).to.be.equal(delay > 95 && delay < 105);
            generator.destroy();
        });
    }

    @test 'interval10Subscribe'() {
        const generator = this.GENERATOR;
        let start = Date.now();
        generator.interval10Subscribe(() => {
            const stop = Date.now();
            const delay = stop - start;
            expect(true).to.be.equal(delay > 5 && delay < 15);
            generator.destroy();
        });
    }

    @test 'intervalCustom'() {
        const generator = this.GENERATOR;
        let start = Date.now();
        const subscription = generator.intervalCustom(() => {
            const stop = Date.now();
            const delay = stop - start;
            // console.log("=====================>", delay);
            expect(true).to.be.equal(delay > 1900 && delay < 2100);
            subscription.unsubscribe();
            generator.destroy();
            start = stop;
        }, 2000);
    }

    @test 'runTickHandler by destroy'() {
        const generator = this.GENERATOR;
        generator.destroy();
        generator.runTickHandler();
        expect(EState.DESTROY).to.be.equal(generator.tickHandlerState);
    }

    @test 'runTickHandler by start'() {
        const generator = this.GENERATOR;
        generator.runTickHandler();
        generator.runTickHandler();
        expect(EState.START).to.be.equal(generator.tickHandlerState);
        generator.destroy();
    }

    @test 'stopTickHandler by DESTROY and STOP'() {
        const generator = this.GENERATOR;
        generator.stopTickHandler();
        generator.stopTickHandler();
        expect(EState.STOP).to.be.equal(generator.tickHandlerState);

        generator.destroy();
        generator.stopTickHandler();
        expect(EState.DESTROY).to.be.equal(generator.tickHandlerState);
    }

    @test 'timeout'() {
        const generator = this.GENERATOR;
        let start = Date.now();
         generator.timeout(() => {
            const stop = Date.now();
            const delay = stop - start;
            // console.log("=====================>", delay);
            expect(true).to.be.equal(delay > 1900 && delay < 2100);
            generator.destroy();
        }, 2000);
    }
}