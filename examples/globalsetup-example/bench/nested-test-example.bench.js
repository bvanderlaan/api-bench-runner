'use strict';

suite('Nested Status Test', () => {
  suite('Parallel', () => {
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

  suite('Sequential', () => {
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
