var util = require('util');
var spawn = require('child_process').spawn;
var which = require('shelljs').which;

function createSlimPreprocessor(config, logger) {
  var log, slimCommand, slimCommandAbsolute;

  config = config || {};
  log = logger.create('preprocessor.slim');
  slimCommand = config.slimrb || 'slimrb';
  slimCommandAbsolute = which(slimCommand);
  log.debug('Found slim command `' + slimCommand + '` at: `' + slimCommandAbsolute + '`');

  if(!slimCommandAbsolute) {
    log.error(
      "Could not find the slimrb command in your path: `" + slimCommand + "`\n" +
      "You may need to run `bundle install` in your project, or install it globally.\n" +
      "Or, you can configure where slimrb is inside your karma config file with:\n\t" +
      "slimPreprocessor: { slimrb: '/usr/local/slimrb' }`"
    );
    throw new Error("slimrb command not found");
  }

  return function(content, file, done) {
    var child, html, path, hadError;

    log.debug('Processing "%s".', file.originalPath);

    path = file.originalPath;
    html = '';
    child = spawn(slimCommandAbsolute, [path]);

    // Handle an error from stderr, which would be a slim syntax error
    child.stderr.on('data', function (buf) {
      hadError = true;
      log.error(String(buf));
      done(String(buf), null);
    });

    child.stdout.on('data', function (buf) {
      html += String(buf);
    });

    child.stdout.on('close', function (buf) {
      if(!hadError) {
        done(null, html);
      }
    });
  };
}

createSlimPreprocessor.$inject = ['config.slimPreprocessor', 'logger'];

module.exports = {
  'preprocessor:slim': ['factory', createSlimPreprocessor]
};


