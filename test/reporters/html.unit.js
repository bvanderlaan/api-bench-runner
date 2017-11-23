'use strict';

const { expect, use: chaiUse } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const apiBenchmarkStub = {
  getHtml: sinon.stub(),
};
const HtmlReporter = proxyquire('../../lib/reporters/html', {
  'api-benchmark': apiBenchmarkStub,
});

chaiUse(chaiAsPromised);
chaiUse(sinonChai);

describe('Formatters - HTML', () => {
  describe('set file name', () => {
    it('should default to benchmarks', () => {
      const reporter = new HtmlReporter();
      expect(reporter.output).to.equal('benchmarks.html');
    });

    it('should allow setting of output file name', () => {
      const reporter = new HtmlReporter('myFile.yo.html');
      expect(reporter.output).to.equal('myFile.yo.html');
    });
  });

  describe('suite', () => {
    it('should set the current suite name', () => {
      const reporter = new HtmlReporter();
      expect(reporter.currentSuite).to.be.empty;

      reporter.suite('my suite');
      expect(reporter.currentSuite).to.equal('my suite');
    });

    it('should reset the current suite name', () => {
      const reporter = new HtmlReporter();
      reporter.suite('my suite');
      expect(reporter.currentSuite).to.equal('my suite');

      reporter.suite('my other suite');
      expect(reporter.currentSuite).to.equal('my other suite');
    });
  });

  describe('results', () => {
    it('should update route name', () => {
      const reporter = new HtmlReporter();
      reporter.suite('my cool suite');
      reporter.results({
        'my-service': {
          status: {
            name: 'my-service/status',
            href: 'http://0.0.0.0:8080/status',
            stats: {},
            errors: {},
            options: {},
            request: {},
            response: {},
            hz: 736.9077700246974,
          },
        },
      });

      expect(reporter.masterResults).to.deep.equals({
        'my-service': {
          'my cool suite - status': {
            name: 'my cool suite - my-service/status',
            href: 'http://0.0.0.0:8080/status',
            stats: {},
            errors: {},
            options: {},
            request: {},
            response: {},
            hz: 736.9077700246974,
          },
        },
      });
    });

    it('should append results', () => {
      const reporter = new HtmlReporter();
      reporter.suite('my cool suite');
      reporter.results({
        'my-service': {
          status: {
            name: 'my-service/status',
            href: 'http://0.0.0.0:8080/status',
            stats: {},
            errors: {},
            options: {},
            request: {},
            response: {},
            hz: 736.9077700246974,
          },
        },
      });

      reporter.suite('my other cool suite');
      reporter.results({
        'my-service': {
          status: {
            name: 'my-service/status',
            href: 'http://0.0.0.0:8080/status',
            stats: {},
            errors: {},
            options: {},
            request: {},
            response: {},
            hz: 531.9453970071937,
          },
        },
      });

      expect(reporter.masterResults).to.deep.equals({
        'my-service': {
          'my cool suite - status': {
            name: 'my cool suite - my-service/status',
            href: 'http://0.0.0.0:8080/status',
            stats: {},
            errors: {},
            options: {},
            request: {},
            response: {},
            hz: 736.9077700246974,
          },
          'my other cool suite - status': {
            name: 'my other cool suite - my-service/status',
            href: 'http://0.0.0.0:8080/status',
            stats: {},
            errors: {},
            options: {},
            request: {},
            response: {},
            hz: 531.9453970071937,
          },
        },
      });
    });

    it('should support multiple services', () => {
      const reporter = new HtmlReporter();
      reporter.suite('my cool suite');
      reporter.results({
        'my-service': {
          status: {
            name: 'my-service/status',
            href: 'http://0.0.0.0:8080/status',
            stats: {},
            errors: {},
            options: {},
            request: {},
            response: {},
            hz: 736.9077700246974,
          },
        },
        'my-other-service': {
          status: {
            name: 'my-other-service/status',
            href: 'http://0.0.0.0:8181/status',
            stats: {},
            errors: {},
            options: {},
            request: {},
            response: {},
            hz: 736.9077700246974,
          },
        },
      });

      reporter.suite('my other cool suite');
      reporter.results({
        'my-service': {
          status: {
            name: 'my-service/status',
            href: 'http://0.0.0.0:8080/status',
            stats: {},
            errors: {},
            options: {},
            request: {},
            response: {},
            hz: 531.9453970071937,
          },
        },
      });

      expect(reporter.masterResults).to.deep.equals({
        'my-service': {
          'my cool suite - status': {
            name: 'my cool suite - my-service/status',
            href: 'http://0.0.0.0:8080/status',
            stats: {},
            errors: {},
            options: {},
            request: {},
            response: {},
            hz: 736.9077700246974,
          },
          'my other cool suite - status': {
            name: 'my other cool suite - my-service/status',
            href: 'http://0.0.0.0:8080/status',
            stats: {},
            errors: {},
            options: {},
            request: {},
            response: {},
            hz: 531.9453970071937,
          },
        },
        'my-other-service': {
          'my cool suite - status': {
            name: 'my cool suite - my-other-service/status',
            href: 'http://0.0.0.0:8181/status',
            stats: {},
            errors: {},
            options: {},
            request: {},
            response: {},
            hz: 736.9077700246974,
          },
        },
      });
    });
  });

  describe('error', () => {
    before(() => sinon.stub(process.stderr, 'write'));
    after(() => process.stderr.write.restore());

    it('should write out error', () => {
      const reporter = new HtmlReporter();
      reporter.error('my suite', 'my error');

      expect(process.stderr.write).to.have.been.calledOnce;
      expect(process.stderr.write).to.have.been.calledWith('  \x1b[31mmy suite - my error\x1b[39m\n');
    });
  });

  describe('summary', () => {
    describe('when api-benchmark get HTML fails', () => {
      before(() => {
        apiBenchmarkStub.getHtml.reset();
        apiBenchmarkStub.getHtml.yields(new Error('boom'));
        sinon.stub(process.stderr, 'write');
      });
      after(() => {
        apiBenchmarkStub.getHtml.reset();
        process.stderr.write.restore();
      });

      it('should write out error', () => {
        const reporter = new HtmlReporter();
        return expect(reporter.summary())
          .to.eventually.be.fulfilled
          .then(() => {
            expect(process.stderr.write).to.have.been.calledOnce;
            expect(process.stderr.write).to.have.been.calledWith('  \x1b[31mFailed to generate HTML: boom\x1b[39m\n');
          });
      });
    });

    describe('when fails to write file', () => {
      before(() => {
        apiBenchmarkStub.getHtml.reset();
        apiBenchmarkStub.getHtml.yields();
        sinon.stub(fs, 'writeFile').yields(new Error('boom'));
        sinon.stub(process.stderr, 'write');
      });
      after(() => {
        apiBenchmarkStub.getHtml.reset();
        fs.writeFile.restore();
        process.stderr.write.restore();
      });

      it('should write out error', () => {
        const reporter = new HtmlReporter();
        return expect(reporter.summary())
          .to.eventually.be.fulfilled
          .then(() => {
            expect(process.stderr.write).to.have.been.calledOnce;
            expect(process.stderr.write).to.have.been.calledWith('  \x1b[31mFailed to generate HTML: boom\x1b[39m\n');
          });
      });
    });

    describe('when success', () => {
      beforeEach(() => {
        apiBenchmarkStub.getHtml.reset();
        apiBenchmarkStub.getHtml.yields();
        sinon.stub(fs, 'writeFile').yields();
        sinon.stub(process.stderr, 'write');
      });
      afterEach(() => {
        apiBenchmarkStub.getHtml.reset();
        fs.writeFile.restore();
        process.stderr.write.restore();
      });

      it('should not write any errors', () => {
        const reporter = new HtmlReporter();
        return expect(reporter.summary())
          .to.eventually.be.fulfilled
          .then(() => {
            expect(process.stderr.write).to.have.not.been.called;
          });
      });

      it('should write file to disk', () => {
        const reporter = new HtmlReporter();
        return expect(reporter.summary())
          .to.eventually.be.fulfilled
          .then(() => {
            expect(fs.writeFile).to.have.been.calledOnce;
            expect(fs.writeFile).to.have.been.calledWith('benchmarks.html', sinon.match.any);
          });
      });

      it('should write file to disk with given filename', () => {
        const reporter = new HtmlReporter('myFile.html');
        return expect(reporter.summary())
          .to.eventually.be.fulfilled
          .then(() => {
            expect(fs.writeFile).to.have.been.calledOnce;
            expect(fs.writeFile).to.have.been.calledWith('myFile.html', sinon.match.any);
          });
      });
    });
  });
});
