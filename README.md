# karma-slim-preprocessor

[![Build Status](https://travis-ci.org/Scrimmage/karma-slim-preprocessor.svg?branch=master)](https://travis-ci.org/Scrimmage/karma-slim-preprocessor)

> Preprocessor for converting slim files to html templates.

It requires the slimrb binary to be on your path, which will be present if slim
is installed by bundler.

## Installation

```bash
npm install karma-slim-preprocessor --save-dev
```

## Configuration

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.slim': ['slim']
    },

    slimPreprocessor: {
      // If slimrb is not in your PATH, you can specify where it is:
      slimrb: "/usr/local/slimrb",
      
      // You can pass additional command line options to slimrb:
      slimrbOption: '-l { "foosball": true }' // or as array ['-l { "foosball": true }', '-r slim/smart']
    },

    files: [
      '**/*.js',
      '**/*.slim',
    ]
  });
};
```

