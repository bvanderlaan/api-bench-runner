'use strict';

const { expect, use: chaiUse } = require('chai');
const chaiThings = require('chai-things');

const reporters = require('../../lib/reporters');
const Html = require('../../lib/reporters/html');
const Stdterm = require('../../lib/reporters/stdterm');

chaiUse(chaiThings);

describe('Get Reporters', () => {
  it('should return default on invalid', () => {
    expect(reporters.getReporter('sup').reporters)
      .to.include.something.that.is.an.instanceof(Stdterm);
  });

  it('should return default (stdterm)', () => {
    expect(reporters.getReporter('default').reporters)
      .to.include.something.that.is.an.instanceof(Stdterm);
  });

  it('should return stdterm', () => {
    expect(reporters.getReporter('stdterm').reporters)
      .to.include.something.that.is.an.instanceof(Stdterm);
  });

  it('should return html', () => {
    expect(reporters.getReporter('html').reporters)
      .to.include.something.that.is.an.instanceof(Html);
  });

  it('should support multiple reporters', () => {
    const reporter = reporters.getReporter('stdterm,html');
    expect(reporter.reporters).to.have.length(2);
    expect(reporter.reporters)
      .to.include.something.that.is.an.instanceof(Stdterm);
    expect(reporter.reporters)
      .to.include.something.that.is.an.instanceof(Html);
  });

  it('should not allow duplicate reporters', () => {
    const reporter = reporters.getReporter('html,html');
    expect(reporter.reporters).to.have.length(1);
    expect(reporter.reporters)
      .to.include.something.that.is.an.instanceof(Html);
  });

  it('should not allow both stdterm(default) and default', () => {
    const reporter = reporters.getReporter('stdterm,default');
    expect(reporter.reporters).to.have.length(1);
    expect(reporter.reporters)
      .to.include.something.that.is.an.instanceof(Stdterm);
  });

  it('should strip invalid reporters', () => {
    const reporter = reporters.getReporter('html,sup');
    expect(reporter.reporters).to.have.length(1);
    expect(reporter.reporters)
      .to.include.something.that.is.an.instanceof(Html);
  });
});
