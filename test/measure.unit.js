'use strict';

const { expect, use: chaiUse } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const benchmarks = require('api-benchmark');

const Suite = require('../lib/suite');

chaiUse(sinonChai);
chaiUse(chaiAsPromised);

const { measure } = require('../lib/measure');

describe('Measure', () => {
  describe('Benchmarks', () => {
    before(() => {
      sinon.stub(benchmarks, 'measure').yields();
      sinon.spy(process.stdout, 'write');
    });

    after(() => {
      benchmarks.measure.restore();
      process.stdout.write.restore();
    });

    it('should run benchmarks', () => {
      const theSuite = new Suite('name');
      theSuite.addServiceHook('my-service', 'http://localhost:2323');
      theSuite.addRoute('status', {
        method: 'get',
        route: 'status',
        expectedStatusCode: 200,
        maxMean: 0.2, // 200ms
      });
      theSuite.setOptions({
        debug: true,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
      });

      return expect(measure(theSuite))
        .to.eventually.be.fulfilled
        .then(() => {
          expect(benchmarks.measure).to.have.been.calledOnce;
          expect(benchmarks.measure)
            .to.have.been.calledWith(theSuite.services, theSuite.routes, theSuite.options, sinon.match.func);
        });
    });
  });

  describe('Display Test Starts', () => {
    before(() => {
      sinon.stub(benchmarks, 'measure').yields();
      sinon.spy(process.stdout, 'write');
    });

    after(() => {
      benchmarks.measure.restore();
      process.stdout.write.restore();
    });

    it('should print out that the suite has started', () => (
      expect(measure(new Suite('name')))
        .to.eventually.be.fulfilled
        .then(() => {
          expect(process.stdout.write).to.have.been.called;
          expect(process.stdout.write).to.have.been.calledWith('  name\n');
        })
    ));
  });

  describe('Display test ended', () => {
    before(() => {
      sinon.stub(benchmarks, 'measure').yields();
      sinon.spy(process.stdout, 'write');
    });

    after(() => {
      benchmarks.measure.restore();
      process.stdout.write.restore();
    });

    it('should print out that the suite has ended', () => (
      expect(measure(new Suite('name')))
        .to.eventually.be.fulfilled
        .then(() => {
          expect(process.stdout.write).to.have.been.called;
          expect(process.stdout.write).to.have.been.calledWith('  Done\n');
        })
    ));
  });

  describe('Display test errors', () => {
    before(() => {
      sinon.stub(benchmarks, 'measure').yields('boo');
      sinon.spy(process.stdout, 'write');
    });

    after(() => {
      benchmarks.measure.restore();
      process.stdout.write.restore();
    });

    it('should print out that the suite has ended with errors', () => (
      expect(measure(new Suite('name')))
        .to.eventually.be.rejected
        .then(() => {
          expect(process.stdout.write).to.have.been.called;
          expect(process.stdout.write).to.have.been.calledWith('\x1b[31m  Done with errors: Error: boo\n\x1b[39m');
        })
    ));
  });
});
