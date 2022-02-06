import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {TickGenerator} from "../src/Libraries/TickGenerator/TickGenerator";

_chai.should();
_chai.expect;

@suite
class TickGeneratorUnitTest{
    private GENERATOR: TickGenerator

    before() {
        this.GENERATOR = new TickGenerator();
    }

    @test 'Generator is created'() {
        // @ts-ignore
        expect(this.GENERATOR.helloWorld()).to.be.equal('Hello world');
    }
}