'use strict';

rootSuite(() => {
  let server;
  service('my-service', () => server.url);

  before((done) => {
    server = require('../simple-server/server'); // eslint-disable-line global-require
    server.once('listening', () => {
      done();
    });
  });

  after((done) => {
    server.close((err) => {
      if (err) {
        console.log('Error shutting down server'); // eslint-disable-line no-console
      } else {
        console.log('Server shutdown!'); // eslint-disable-line no-console
      }
      done();
    });
  });
});
