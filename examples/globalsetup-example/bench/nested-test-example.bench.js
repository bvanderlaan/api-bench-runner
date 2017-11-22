'use strict';

suite('Nested Status Test', () => {
  suite('Multiple requests in Parallel', () => {
    options({
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

  suite('Multiple requests in Sequence', () => {
    options({
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
});
