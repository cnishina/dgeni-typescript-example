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
.config((log, readFilesProcessor, writeFilesProcessor) => {
  // Set the log level to 'info', switch to 'debug' when troubleshooting.
  log.level = 'info';

  // Specify the base path used when resolving relative paths to source and
  // output files.
  readFilesProcessor.basePath = path.resolve(packagePath, '../..');

  // Specify our source files that we want to extract (all the app files).
  readFilesProcessor.sourceFiles = [
      { include: 'src/app/**/**/*.js', basePath: 'src/app' },
  ];

  // Use the writeFilesProcessor to specify the output folder for the extracted
  // files.
  writeFilesProcessor.outputFolder = 'docs/build';
})

/**
 * Setup the templates.
 */
.config((templateFinder) => {
  // Specify where the templates are located
  templateFinder.templateFolders.unshift(
    path.resolve(packagePath, 'templates'));
})

/**
 * Setup the Dgeni processors.
 */
.config((computePathsProcessor) => {
  // Here we are defining what to output for our docType Module.
  //
  // Each angular module will be extracted to it's own partial and will act as
  // a container for the various Components, Controllers, Services in that
  // Module. We are basically specifying where we want the output files to be
  // located.
  computePathsProcessor.pathTemplates.push({
      docTypes: ['module'],
      pathTemplate: '${area}/${name}',
      outputPathTemplate: 'partials/${area}/${name}.html'
  });

  // Doing the same thing but for regular types like Services, Controllers,
  // etc... By default they are grouped in a componentGroup and processed
  // via the generateComponentGroupsProcessor internally in Dgeni
  computePathsProcessor.pathTemplates.push({
      docTypes: ['componentGroup'],
      pathTemplate: '${area}/${moduleName}/${groupType}',
      outputPathTemplate: 'partials/${area}/${moduleName}/${groupType}.html'
  });
})