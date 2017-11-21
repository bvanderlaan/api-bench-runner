'use strict';

suite('Simple Status Test', () => {
  options({
    debug: true,
    runMode: 'parallel',
    minSamples: 200,
    maxTime: 20,
  });

  route('status', {
    method: 'get',
    route: 'status',
    expectedStatusCode: 200,
    maxMean: 0.2, // 200ms
  });
});
