'use strict';

const { expect, use: chaiUse } = require('chai');
const { after: mochaAfter, before: mochaBefore } = require('mocha');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chaiUse(sinonChai);

const measureStub = sinon.stub().resolves();

const {
  options,
  route,
  service,
  suite,
  before: myBefore,
  after: myAfter,
} = proxyquire('../lib/hooks', {
  './measure': {
    measure: measureStub,
  },
});

describe('Hooks', () => {
  it('should add global suite function', () => {
    expect(global.suite).to.exist.and.be.a('function');
  });

  it('should add global describe function', () => {
    expect(global.describe).to.exist.and.be.a('function');
  });

  it('should add global service function', () => {
    expect(global.service).to.exist.and.be.a('function');
  });

  it('should add global options function', () => {
    expect(global.options).to.exist.and.be.a('function');
  });

  it('should add global route function', () => {
    expect(global.route).to.exist.and.be.a('function');
  });

  it('should add global before function', () => {
    expect(global.before).to.exist.and.be.a('function');
  });

  it('should add global after function', () => {
    expect(global.after).to.exist.and.be.a('function');
  });

  describe('Suite', () => {
    it('should call the callback', () => {
      const cb = sinon.stub();
      return suite('name', cb)
        .then(() => {
          expect(cb, 'callback').to.have.been.calledOnce;
        });
    });

    describe('measure', () => {
      mochaBefore(() => measureStub.resetHistory());
      mochaAfter(() => measureStub.resetHistory());

      it('should call measure', () => (
        suite('name', sinon.stub())
          .then(() => {
            expect(measureStub, 'measure').to.have.been.calledOnce;
          })
      ));
    });

    describe('before', () => {
      it('should call the before callback', () => {
        const beforeCallback = sinon.stub();
        return suite('name', () => {
          myBefore(beforeCallback);
        })
          .then(() => {
            expect(beforeCallback, 'beforeCallBack').to.have.been.calledOnce;
          });
      });

      it('should call all the before callbacks', () => {
        const beforeCallback = sinon.stub();
        const beforeCallback2 = sinon.stub();
        const beforeCallback3 = sinon.stub();

        return suite('name', () => {
          myBefore(beforeCallback);
          myBefore(beforeCallback2);
          myBefore(beforeCallback3);
        })
          .then(() => {
            expect(beforeCallback, 'beforeCallBack').to.have.been.calledOnce;
            expect(beforeCallback2, 'beforeCallBack2').to.have.been.calledOnce;
            expect(beforeCallback3, 'beforeCallBack3').to.have.been.calledOnce;
          });
      });

      it('should call the before callback asynchronously', () => {
        function cb(done) {
          done();
        }
        const beforeCallback = sinon.spy(cb);
        return suite('name', () => {
          myBefore(beforeCallback);
        })
          .then(() => {
            expect(beforeCallback, 'beforeCallBack').to.have.been.calledOnce;
          });
      });

      it('should call the before callback asynchronously via promise', () => {
        const beforeCallback = sinon.stub().resolves(42);
        return suite('name', () => {
          myBefore(beforeCallback);
        })
          .then(() => {
            expect(beforeCallback, 'beforeCallBack').to.have.been.calledOnce;
          });
      });
    });

    describe('after', () => {
      it('should call the after callback', () => {
        const afterCallback = sinon.stub();
        return suite('name', () => {
          myAfter(afterCallback);
        })
          .then(() => {
            expect(afterCallback, 'afterCallback').to.have.been.calledOnce;
          });
      });

      it('should call all the after callbacks', () => {
        const afterCallback = sinon.stub();
        const afterCallback2 = sinon.stub();
        const afterCallback3 = sinon.stub();

        return suite('name', () => {
          myAfter(afterCallback);
          myAfter(afterCallback2);
          myAfter(afterCallback3);
        })
          .then(() => {
            expect(afterCallback, 'afterCallback').to.have.been.calledOnce;
            expect(afterCallback2, 'afterCallback2').to.have.been.calledOnce;
            expect(afterCallback3, 'afterCallback3').to.have.been.calledOnce;
          });
      });

      it('should call the after callback asynchronously', () => {
        function cb(done) {
          done();
        }
        const afterCallback3 = sinon.spy(cb);
        return suite('name', () => {
          myAfter(afterCallback3);
        })
          .then(() => {
            expect(afterCallback3, 'afterCallback3').to.have.been.calledOnce;
          });
      });

      it('should call the after callback asynchronously via promise', () => {
        const afterCallback3 = sinon.stub().resolves(42);
        return suite('name', () => {
          myAfter(afterCallback3);
        })
          .then((t) => {
            expect(t).to.equal(42);
            expect(afterCallback3, 'afterCallback3').to.have.been.calledOnce;
          });
      });
    });
  });

  describe('Service', () => {
    beforeEach(() => measureStub.resetHistory());
    afterEach(() => measureStub.resetHistory());

    it('should set service', () => (
      suite('name', () => {
        service('my-service', 'http://localhost:8080');
      })
        .then(() => {
          expect(measureStub, 'measure').to.have.been.calledOnce;
          const theSuite = measureStub.firstCall.args[0];
          expect(theSuite.services).to.deep.equals({
            'my-service': 'http://localhost:8080',
          });
        })
    ));

    it('should set service after the before hook', () => {
      let url;
      return suite('name', () => {
        myBefore(() => { url = 'http://localhost:8080'; });
        service('my-service', () => url);
      })
        .then(() => {
          expect(measureStub, 'measure').to.have.been.calledOnce;
          const theSuite = measureStub.firstCall.args[0];
          expect(theSuite.services).to.deep.equals({
            'my-service': 'http://localhost:8080',
          });
        });
    });
  });

  describe('Options', () => {
    beforeEach(() => measureStub.resetHistory());
    afterEach(() => measureStub.resetHistory());

    it('should set options', () => (
      suite('name', () => {
        options({
          runMode: 'parallel',
          minSamples: 200,
          maxTime: 20,
        });
      })
        .then(() => {
          expect(measureStub, 'measure').to.have.been.calledOnce;
          const theSuite = measureStub.firstCall.args[0];
          expect(theSuite.options).to.deep.equals({
            debug: false,
            delay: 0,
            maxConcurrentRequests: 100,
            runMode: 'parallel',
            minSamples: 200,
            maxTime: 20,
            stopOnError: true,
          });
        })
    ));

    it('should set options and respect debug', () => (
      suite('name', () => {
        options({
          debug: false,
          runMode: 'parallel',
          minSamples: 200,
          maxTime: 20,
        });
      })
        .then(() => {
          expect(measureStub, 'measure').to.have.been.calledOnce;
          const theSuite = measureStub.firstCall.args[0];
          expect(theSuite.options).to.deep.equals({
            debug: false,
            delay: 0,
            maxConcurrentRequests: 100,
            runMode: 'parallel',
            minSamples: 200,
            maxTime: 20,
            stopOnError: true,
          });
        })
    ));
  });

  describe('Route', () => {
    beforeEach(() => measureStub.resetHistory());
    afterEach(() => measureStub.resetHistory());

    it('should set route', () => (
      suite('name', () => {
        route('status', {
          method: 'get',
          route: 'status',
          expectedStatusCode: 200,
          maxMean: 0.2, // 200ms
        });
      })
        .then(() => {
          expect(measureStub, 'measure').to.have.been.calledOnce;
          const theSuite = measureStub.firstCall.args[0];
          expect(theSuite.routes).to.deep.equals({
            status: {
              method: 'get',
              route: 'status',
              expectedStatusCode: 200,
              maxMean: 0.2, // 200ms
            },
          });
        })
    ));
  });
});
