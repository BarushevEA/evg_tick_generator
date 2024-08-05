import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {GMeter} from "../src/Libraries/TickGenerator/GMeter";

_chai.should();
_chai.expect;

@suite
class GTimeoutTests {
    private gMeter: GMeter;

    before() {
        this.gMeter = new GMeter();
    }

    @test
    async 'should decorate async function with delay'() {
        // Async function with delay
        const asyncFunction = async (num: number): Promise<number> => {
            return new Promise(resolve =>
                setTimeout(() => resolve(num * 2), Math.round(Math.random() * 1000)) // delay inside the function
            );
        };

        const decoratedAsyncFunction = this.gMeter.decorateAsync('asyncFunction', asyncFunction);
        this.gMeter.start();

        const result1Promise = decoratedAsyncFunction(5); // start execution
        const result2Promise = decoratedAsyncFunction(10); // start execution before the first one ended

        // Wait for all functions to complete
        const [result1, result2] = await Promise.all([result1Promise, result2Promise]);

        // Check the results
        expect(result1).to.equal(10);
        expect(result2).to.equal(20);
        expect(2).to.equal(this.gMeter.getMetrics("asyncFunction").countOfUses);

        this.gMeter.stop();
    }
}
