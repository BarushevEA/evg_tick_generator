import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {TickGenerator} from "../src/Libraries/TickGenerator/TickGenerator";
import {EState} from "../src/Libraries/TickGenerator/Env";
import {ICallback} from "evg_observable/src/outLib/Types";

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
            expect(EState.START).to.be.equal(observable.getValue());
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

        generator.stopAnimation();
        generator.animationStateSubscribe((state: EState) => {
            expect(EState.START).to.be.equal(state);
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

        generator.animationStateSubscribe((state: EState) => {
            expect(EState.STOP).to.be.equal(state);
        })

        generator.stopAnimation();
    }

    @test 'animationSubscribe(callback: ICallback<any>)'() {
        const generator = this.GENERATOR;
        let counter = 0;
        const listener = () => counter++;
        generator.stopAnimation();
        generator.animationSubscribe(listener);
        generator.runAnimation();
        expect(1).to.be.equal(counter);
    }

    @test 'animationBeforeSubscribe(callback: ICallback<any>)'() {
        const generator = this.GENERATOR;
        let counterBefore = 0;
        let counterGeneral = 0;
        const listenerBefore = () => counterBefore++;
        const listenerGeneral = () => counterGeneral = counterGeneral + counterBefore;
        generator.stopAnimation();
        generator.animationBeforeSubscribe(listenerBefore);
        generator.animationSubscribe(listenerGeneral);
        generator.runAnimation();
        expect(1).to.be.equal(counterGeneral);
    }

    @test 'animationAfterSubscribe(callback: ICallback<any>)'() {
        const generator = this.GENERATOR;
        let counterAfter = 0;
        let counterGeneral = 0;
        const listenerAfter = () => counterAfter = counterAfter+counterGeneral;
        const listenerGeneral = () => counterGeneral++;
        generator.stopAnimation();
        generator.animationAfterSubscribe(listenerAfter);
        generator.animationSubscribe(listenerGeneral);
        generator.runAnimation();

        expect(1).to.be.equal(counterAfter);
    }

    @test 'animationStateSubscribe(callback: ICallback<any>) on start'() {
        const generator = this.GENERATOR;
        generator.stopAnimation();
        expect(EState.STOP).to.be.equal(generator.animationState);

        const listener = (state: EState)=>expect(EState.START).to.be.equal(state);
        generator.animationStateSubscribe(listener);
        generator.runAnimation();

        expect(EState.START).to.be.equal(generator.animationState);
    }

    @test 'animationStateSubscribe(callback: ICallback<any>) on multi start'() {
        const generator = this.GENERATOR;
        let counter = 0;
        generator.stopAnimation();
        expect(EState.STOP).to.be.equal(generator.animationState);

        const listener = (state: EState)=> {
            expect(EState.START).to.be.equal(state);
            counter++;
        }
        generator.animationStateSubscribe(listener);
        generator.runAnimation();
        generator.runAnimation();
        generator.runAnimation();

        expect(EState.START).to.be.equal(generator.animationState);
        expect(1).to.be.equal(counter);
    }

    @test 'requestAnimationFrame undefined'(){
        globalThis.requestAnimationFrame = undefined;
        const generator = new TickGenerator();
        expect(EState.UNDEFINED).to.be.equal(generator.animationState);

        generator.stopAnimation();
        expect(EState.UNDEFINED).to.be.equal(generator.animationState);

        generator.destroy();
        expect(EState.DESTROY).to.be.equal(generator.animationState);
    }
}