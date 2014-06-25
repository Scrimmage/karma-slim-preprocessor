# karma-slim-preprocessor

> Preprocessor for converting slim files to html templates.

It requires the slimrb binary to be on your path, which will be present if slim
is installed by bundler.

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

    files: [
      '**/*.js',
      '**/*.slim',
    ]
  });
};
```

