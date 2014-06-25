var util = require('util');
var spawn = require('child_process').spawn

var createSlimPreprocessor = function(logger) {
  config = typeof config === 'object' ? config : {};

  var log = logger.create('preprocessor.slim');

  return function(content, file, done) {
    var child, html, origPath

    log.debug('Processing "%s".', file.originalPath);

    origPath = file.originalPath
    html = ''
    child = spawn("slimrb", [origPath])

    child.stdout.on('data', function (buf) {
      html += String(buf);
    });

    child.stdout.on('close', function (buf) {
      done(html);
    });

    child.stderr.on('data', function (buf) {
      throw String(buf);
    });
  };
};

createSlimPreprocessor.$inject = ['logger'];

module.exports = createSlimPreprocessor;
