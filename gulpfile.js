const gulp = require('gulp');
const Dgeni = require('dgeni');

const server = require('browser-sync');
const root = 'src/';
const paths = {
  dist: './dist/',
  distDocs: './docs/build',
  docs: './docs/app/*.js',
  scripts: [`${root}/app/**/*.js`, `!${root}/app/**/*.spec.js`],
  tests: `${root}/app/**/*.spec.js`,
  styles: `${root}/sass/*.scss`,
  templates: `${root}/app/**/*.html`,
  modules: [
    'angular/angular.js',
    'angular-ui-router/release/angular-ui-router.js',
    'firebase/firebase.js',
    'angularfire/dist/angularfire.js',
    'angular-loading-bar/build/loading-bar.min.js'
  ],
  static: [
    `${root}/index.html`,
    `${root}/fonts/**/*`,
    `${root}/img/**/*`
  ]
};
server.create();

gulp.task('dgeni', function() {
  // Notice how we are specifying which config to use
  // This will import the index.js from the /docs/config folder and will use that
  // configuration file while generating the documentation
  var dgeni = new Dgeni([require('./docs/config/index')]);

  // Using the dgeni.generate() method
  return dgeni.generate();
});

gulp.task('serve', () => {
  return server.init({
    files: [`${paths.distDocs}/**`],
    port: 4000,
    server: {
      baseDir: paths.distDocs
    }
  });
});
