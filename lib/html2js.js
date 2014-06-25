var util = require('util');
var spawn = require('child_process').spawn

var createSlimPreprocessor = function(logger, basePath, config) {
  config = typeof config === 'object' ? config : {};

  var log = logger.create('preprocessor.slim');

  var stripPrefix = new RegExp('^' + (config.stripPrefix || ''));
  var prependPrefix = config.prependPrefix || '';
  var cacheIdFromPath = config && config.cacheIdFromPath || function(filepath) {
    return prependPrefix + filepath.replace(stripPrefix, '');
  };

  return function(content, file, done) {
    var child, html

    log.debug('Processing "%s".', file.originalPath);

    var htmlPath = cacheIdFromPath(file.originalPath.replace(basePath + '/', ''));

    var origPath = file.path
    // TODO ???
    file.path = file.path + '.js';

    // TODO
    origPath = origPath.split("queue-web-client/")[1]
    log.debug("Spawning", origPath)

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

createSlimPreprocessor.$inject = ['logger', 'config.basePath', 'config.ngHtml2JsPreprocessor'];

module.exports = createSlimPreprocessor;
