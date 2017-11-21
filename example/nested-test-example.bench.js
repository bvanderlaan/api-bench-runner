suite('Nested Status Test', () => {
  let server;

  before((done) => {
    server = require('./simple-server/server'); // eslint-disable-line global-require
    server.once('listening', () => {
      done();
    });
  });

  after((done) => {
    server.close((err) => {
      if (err) {
        console.log('Error shutting down server'); // eslint-disable-line no-console
      } else {
        console.log('Server shutdown'); // eslint-disable-line no-console
      }
      done();
    });
  });

  service('my-service', () => server.url);

  suite('Parallel', () => {
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

  suite('Sequential', () => {
    options({
      debug: true,
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
