var util = require('util');
var spawn = require('child_process').spawn;

function createSlimPreprocessor(config, logger) {
  var log, slimrb;

  config = config || {};
  log = logger.create('preprocessor.slim');
  slimrb = config.slimrb || 'slimrb';

  return function(content, file, done) {
    var child, html, path, hadError;

    log.debug('Processing "%s".', file.originalPath);

    path = file.originalPath;
    html = ''
    child = spawn(slimrb, [path]);

    // Handle an error in the command, such as slimrb not found
    child.on('error', function (error) {
      if (error.code === 'ENOENT') {
        log.error(
          "It does not appear as though `slimrb` is installed.\n" +
          "You may need to run `bundle install` in your project, or install it globally.\n" +
          "If you're having PATH issues you can configure where slimrb, inside your karma config file:\n\t" +
          "slimPreprocessor: { slimrb: '/usr/local/slimrb' }`"
        );
      }
      if(!hadError) {
        hadError = true;
        done('');
      }
    });

    // Handle an error from stderr, which would be a slim syntax error
    child.stderr.on('data', function (buf) {
      // We already had a command error, don't call done twice
      if(!hadError) {
        hadError = true;
        log.error("Error compiling slim template:\n" + String(buf));
        done('');
      }
    });

    child.stdout.on('data', function (buf) {
      html += String(buf);
    });

    child.stdout.on('close', function (buf) {
      // Don't call done again if we had a syntax error
      if(!hadError) {
        done(html);
      }
    });

  };
}

createSlimPreprocessor.$inject = ['config.slimPreprocessor', 'logger'];

module.exports = {
  'preprocessor:slim': ['factory', createSlimPreprocessor]
};


