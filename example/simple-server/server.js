'ues strict';

const express = require('express'); // eslint-disable-line import/no-extraneous-dependencies

const { version } = require('../../package.json');

const port = process.env.APP_PORT || 8080;
const app = express();

app.get('/status', (_, res) => {
  res.status(200).json({
    version,
    name: 'example-server',
    message: 'Just a test',
  });
});

const server = app.listen(port, '0.0.0.0', () => {
  const { address, port: p } = server.address();
  server.url = `http://${address}:${p}`;
  console.log(`Listening on ${server.url}`); // eslint-disable-line no-console
});

module.exports = server;
