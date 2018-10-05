// Reference: https://toddmotto.com/documenting-angular-dgeni
const path = require('canonical-path');
const packagePath = __dirname;
const Package = require('dgeni').Package;

/**
 * Create and export a new Dgeni package.
 *
 * We will use Gulp later on to generate that package. Think of packages as
 * containers, our 'myDoc' package contains other packages which themselves
 * include processors, services, templates...
 */
module.exports = new Package('myDoc', [
    require('dgeni-packages/ngdoc'),
    require('dgeni-packages/nunjucks')
])

/**
 * Setup the file reading and writing.
 */
.config(function(log, readFilesProcessor, writeFilesProcessor) {
  // Set the log level to 'info', switch to 'debug' when troubleshooting.
  log.level = 'debug';

  // Specify the base path used when resolving relative paths to source and
  // output files.
  readFilesProcessor.basePath = path.resolve(packagePath, '../..');

  // Specify our source files that we want to extract (all the app files).
  readFilesProcessor.sourceFiles = [ {
    // An attempt to read TypeScript
    include: 'src/lib/**/*.ts',
    basePath: 'src/lib',
    fileReader: 'ngdocFileReader'
  }, {
    // Our static Markdown documents. We are specifying the path and telling
    // Dgeni to use the ngdocFileReader to parse the Markdown files to HTMLs.
    include: 'docs/content/**/*.md',
    basePath: 'docs/content',
    fileReader: 'ngdocFileReader'
  } ];

  // Use the writeFilesProcessor to specify the output folder for the extracted
  // files.
  writeFilesProcessor.outputFolder = 'docs/build';
})

/**
 * Setup the templates.
 */
.config(function(templateFinder) {
  // Specify where the templates are located
  templateFinder.templateFolders.unshift(
    path.resolve(packagePath, 'templates'));
})

/**
 * Setup the Dgeni processors.
 */
.config(function(computePathsProcessor, computeIdsProcessor) {
  // create new compute for 'content' type doc
  // indexPage is something new we will be defining later
  computeIdsProcessor.idTemplates.push({
    docTypes: ['content', 'indexPage'],
    getId: function(doc) { return doc.fileInfo.baseName; },
    getAliases: function(doc) { return [doc.id]; }
  });

  // Build custom paths and set the outputPaths for "content" pages
  computePathsProcessor.pathTemplates.push({
    docTypes: ['content'],
    getPath: function(doc) {
        var docPath = path.dirname(doc.fileInfo.relativePath);
        if (doc.fileInfo.baseName !== 'index') {
            docPath = path.join(docPath, doc.fileInfo.baseName);
        }
        return docPath;
    },
    outputPathTemplate: 'partials/${path}.html'
  });
})