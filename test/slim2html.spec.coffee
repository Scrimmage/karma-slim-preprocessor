describe 'preprocessors slim2html', ->
  chai = require('chai')
  templateHelpers = require('./helpers/template_cache')
  slim2html = require('../index')['preprocessor:slim'][1]
  {which} = require('shelljs')

  chai.use(templateHelpers)
  {expect} = chai

  slimCommand = which 'slimrb'
  if !slimCommand
    throw new Error("Cannot find a slimrb on your path, aborting tests.")

  noop = ->

  logged = null
  logger = create: ->
    logged = {
      debug: ''
      info: ''
      error: ''
    }
    return {
      debug: (msg) -> logged.debug += msg
      info: (msg) -> logged.info += msg
      error: (msg) -> logged.error += msg
    }

  # TODO(vojta): refactor this somehow ;-) it's copy pasted from lib/file-list.js
  File = (path, mtime) ->
    @path = path
    @originalPath = path
    @contentPath = path
    @mtime = mtime
    @isUrl = false


  it 'converts slim to html', (done) ->
    file = new File 'test/fixtures/index.slim'
    process = slim2html({}, logger)
    process '', file, (err, result) ->
      expect(result).to.equal('<h1>Hello</h1><div class="dece">And welcome!</div>\n')
      done()

  it 'logs an error given invalid slim markup', (done) ->
    file = new File 'test/fixtures/invalid.slim'
    process = slim2html({}, logger)
    process '', file, (err, result) ->
      expect(result).to.equal(null)
      expect(logged.error).to.include("Malformed indentation")
      done()

  it 'allows configuring the path of the slimrb binary', (done) ->
    file = new File 'test/fixtures/index.slim'
    process = slim2html({ slimrb: slimCommand }, logger)
    process '', file, (err, result) ->
      expect(result).to.equal('<h1>Hello</h1><div class="dece">And welcome!</div>\n')
      done()

  it 'allows configuring the path of the slimrb binary with the cli options', (done) ->
    file = new File 'test/fixtures/variable.slim'
    slimData =
      foo: "Foooo"
      bar: "Baaar"
    slimDataJsonStr = JSON.stringify(slimData)
    process = slim2html({ slimrb: slimCommand, slimrbOption: '-l ' + slimDataJsonStr }, logger)
    process '', file, (err, result) ->
      expect(result).to.equal('<p>Foo: Foooo!</p><p>Bar: Baaar!</p>\n')
      done()

  it 'allows configuring the path of the slimrb binary with *multiple* cli options', (done) ->
    file = new File 'test/fixtures/smart.slim'
    slimData =
      foo: "Foooo"
      bar: "Baaar"
    localVariablesOpt = '-l ' + JSON.stringify(slimData)
    requireLibOpt = '-r slim/smart'
    process = slim2html({ slimrb: slimCommand, slimrbOption: [localVariablesOpt, requireLibOpt] }, logger)
    process '', file, (err, result) ->
      expect(result).to.equal("<body><h1 id=\"headline\">{{ someAngularVariable }}</h1></body>\n")
      done()

  it 'throws and logs an error given an invalid slim command configuration', (done) ->
    file = new File 'test/fixtures/index.slim'
    expect( ->
      process = slim2html({ slimrb: "foooooooooooo" }, logger)
    ).to.throw("slimrb command not found")
    expect(logged.error).to.include("bundle install")
    expect(logged.error).to.include("slimPreprocessor: { slimrb: '/usr/local/slimrb' }`")
    done()

