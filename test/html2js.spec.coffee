describe 'preprocessors slim2html', ->
  chai = require('chai')

  templateHelpers = require('./helpers/template_cache')
  chai.use(templateHelpers)

  {expect} = chai

  slim2html = require '../lib/slim2html'
  logger = create: -> {debug: ->}
  process = null

  # TODO(vojta): refactor this somehow ;-) it's copy pasted from lib/file-list.js
  File = (path, mtime) ->
    @path = path
    @originalPath = path
    @contentPath = path
    @mtime = mtime
    @isUrl = false

  createPreprocessor = () ->
    slim2html logger

  beforeEach ->
    process = createPreprocessor()

  it 'should convert html to js code', (done) ->
    file = new File 'test/fixtures/index.slim'

    process '', file, (processedContent) ->
      expect(processedContent).to.equal('<h1>Hello</h1><div class="dece">And welcome!</div>\n')
      done()


