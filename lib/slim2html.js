var util = require('util');
var spawn = require('child_process').spawn

var createSlimPreprocessor = function(logger) {
  var log = logger.create('preprocessor.slim');

  return function(content, file, done) {
    var child, html, origPath

    log.debug('Processing "%s".', file.originalPath);

    origPath = file.originalPath
    html = ''
    child = spawn("slimrb", [origPath])

    child.on('error', function (error) {
      if (error.code == 'ENOENT') {
        log.error("It does not appear as though `slimrb` is installed. Try running `bundle install` in your project.")
        done('')
      }
    });

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
