suite('Status', () => {
  let server;

  before((done) => {
    server = require('./simple-server/server'); // eslint-disable-line global-require
    server.once('listening', () => {
      done();
    });
  });

  after(() => {
    server.close((err) => {
      if (err) {
        console.log('Error shutting down server'); // eslint-disable-line no-console
      } else {
        console.log('Server shutdown'); // eslint-disable-line no-console
      }
    });
  });

  service('my-service', () => server.url);

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
