# api-bench-runner

This is a CLI tool which can be used to run [api-benchmark](https://www.npmjs.com/package/api-benchmark) tests. Its interface is inspired by [mocha](https://www.npmjs.com/package/mocha).

### Example of Test file

```js
'use strict';

suite('Status', () => {
  service('my-service', 'http://localhost:8080');

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
        maxMean: 0.2, //200ms
    });
  });

  suite('Sequential', () => {
    options({
      runMode: 'sequence',
      minSamples: 200,
      maxTime: 20,
    });

    route('status', {
        method: 'get',
        route: 'status',
        expectedStatusCode: 200,
        maxMean: 0.2, //200ms
    });
  });
});
```

### Example of Command

```
> node_modules/.bin/api-bench-runner .
```

## Running Tests

To run the tests suite use the `npm test` command.
Make sure to run `npm install` first.

You can have the tests watch for changes and re-run automatically by using the command `npm run watch`.

## Contributing

Bug reports and pull requests are welcome. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](https://contributor-covenant.org/) code of conduct.

## License

The tool is available as open source under the terms of the [MIT License](https://choosealicense.com/licenses/mit/).