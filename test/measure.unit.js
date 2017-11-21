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

function createLoggerStub() {
  return {
    log: sinon.stub(),
    error: sinon.stub(),
  };
}

describe('Measure', () => {
  describe('Benchmarks', () => {
    beforeEach(() => sinon.stub(benchmarks, 'measure').yields());
    afterEach(() => benchmarks.measure.restore());

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
      const reporter = createLoggerStub();

      return theSuite.invokeServiceHooks()
        .then(() => expect(measure(theSuite, reporter))
          .to.eventually.be.fulfilled)
        .then(() => {
          expect(benchmarks.measure).to.have.been.calledOnce;
          expect(benchmarks.measure)
            .to.have.been.calledWith(theSuite.services, theSuite.routes, theSuite.options, sinon.match.func);
        });
    });

    it('should not run benchmarks if service is missing', () => {
      const theSuite = new Suite('name');
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

      const reporter = createLoggerStub();

      return expect(measure(theSuite, reporter))
        .to.eventually.be.fulfilled
        .then(() => {
          expect(benchmarks.measure).to.have.not.been.called;
        });
    });

    it('should not run benchmarks if route is missing', () => {
      const theSuite = new Suite('name');
      theSuite.addServiceHook('my-service', 'http://localhost:2323');
      theSuite.invokeServiceHooks();
      theSuite.setOptions({
        debug: true,
        runMode: 'parallel',
        minSamples: 200,
        maxTime: 20,
      });

      const reporter = createLoggerStub();

      return theSuite.invokeServiceHooks()
        .then(() => expect(measure(theSuite, reporter))
          .to.eventually.be.fulfilled)
        .then(() => {
          expect(benchmarks.measure).to.have.not.been.called;
        });
    });

    it('should run benchmarks even if options are missing, use defaults', () => {
      const theSuite = new Suite('name');
      theSuite.addServiceHook('my-service', 'http://localhost:2323');
      theSuite.addRoute('status', {
        method: 'get',
        route: 'status',
        expectedStatusCode: 200,
        maxMean: 0.2, // 200ms
      });

      const reporter = createLoggerStub();

      return theSuite.invokeServiceHooks()
        .then(() => expect(measure(theSuite, reporter))
          .to.eventually.be.fulfilled)
        .then(() => {
          expect(benchmarks.measure).to.have.been.calledOnce;
          expect(benchmarks.measure)
            .to.have.been.calledWith(theSuite.services, theSuite.routes, theSuite.options, sinon.match.func);
        });
    });
  });

  describe('Display Test Starts', () => {
    before(() => sinon.stub(benchmarks, 'measure').yields());
    after(() => benchmarks.measure.restore());

    it('should print out that the suite has started', () => {
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

      const reporter = createLoggerStub();

      return theSuite.invokeServiceHooks()
        .then(() => expect(measure(theSuite, reporter))
          .to.eventually.be.fulfilled)
        .then(() => {
          expect(reporter.log).to.have.been.called;
          expect(reporter.log).to.have.been.calledWith('name');
        });
    });
  });

  describe('Display test ended', () => {
    before(() => sinon.stub(benchmarks, 'measure').yields());
    after(() => benchmarks.measure.restore());

    it('should print out that the suite has ended', () => {
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

      const reporter = createLoggerStub();

      return theSuite.invokeServiceHooks()
        .then(() => expect(measure(theSuite, reporter))
          .to.eventually.be.fulfilled)
        .then(() => {
          expect(reporter.log).to.have.been.called;
          expect(reporter.log).to.have.been.calledWith('Done');
        });
    });
  });

  describe('Display test errors', () => {
    before(() => sinon.stub(benchmarks, 'measure').yields('boo'));
    after(() => benchmarks.measure.restore());

    it('should print out that the suite has ended with errors', () => {
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

      const reporter = createLoggerStub();

      return theSuite.invokeServiceHooks()
        .then(() => expect(measure(theSuite, reporter))
          .to.eventually.be.rejected)
        .then(() => {
          expect(reporter.error).to.have.been.called;
          expect(reporter.error).to.have.been.calledWith('Done with errors: Error: boo');
        });
    });
  });
});
