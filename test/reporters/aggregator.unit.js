'use strict';

const { expect, use: chaiUse } = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const Aggregator = require('../../lib/reporters/aggregator');

function createReporterMock() {
  return {
    suite: sinon.stub(),
    results: sinon.stub(),
    error: sinon.stub(),
    summary: sinon.stub(),
  };
}

chaiUse(sinonChai);

describe('Formatters - Aggregator', () => {
  it('should call all reporters suite method', () => {
    const r1 = createReporterMock();
    const r2 = createReporterMock();
    const a = new Aggregator(r1, r2);
    a.suite('hello');
    expect(r1.suite).to.have.been.calledOnce;
    expect(r1.suite).to.have.been.calledWith('hello');
    expect(r2.suite).to.have.been.calledOnce;
    expect(r2.suite).to.have.been.calledWith('hello');
  });

  it('should call all reporters results method', () => {
    const r1 = createReporterMock();
    const r2 = createReporterMock();
    const a = new Aggregator(r1, r2);
    a.results({ foo: 'bar' });
    expect(r1.results).to.have.been.calledOnce;
    expect(r1.results).to.have.been.calledWith({ foo: 'bar' });
    expect(r2.results).to.have.been.calledOnce;
    expect(r2.results).to.have.been.calledWith({ foo: 'bar' });
  });

  it('should call all reporters error method', () => {
    const r1 = createReporterMock();
    const r2 = createReporterMock();
    const a = new Aggregator(r1, r2);
    a.error('hello', 'world');
    expect(r1.error).to.have.been.calledOnce;
    expect(r1.error).to.have.been.calledWith('hello', 'world');
    expect(r2.error).to.have.been.calledOnce;
    expect(r2.error).to.have.been.calledWith('hello', 'world');
  });

  it('should call all reporters summary method', () => {
    const r1 = createReporterMock();
    const r2 = createReporterMock();
    const a = new Aggregator(r1, r2);
    a.summary();
    expect(r1.summary).to.have.been.calledOnce;
    expect(r2.summary).to.have.been.calledOnce;
  });
});
