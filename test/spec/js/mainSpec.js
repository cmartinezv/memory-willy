(function() {
  'use strict';

  var lang = localStorage.getItem("lang") || ( localStorage.setItem("lang",'en') || 'en' );

  require.config({
    baseUrl : "../js",
    paths: {
      jquery: [
      'http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
      'vendor/jquery/dist/jquery.min',
      ],
      "jquery-tmpl" : 'vendor/jquery-tmpl/jquery.tmpl.min',
      "hammer" : 'vendor/hammerjs/hammer.min',
      'jasmine': 'vendor/jasmine/dist/jasmine-standalone-2.0.0-rc5/lib/jasmine-2.0.0-rc5/jasmine',
      'jasmine-html': 'vendor/jasmine/dist/jasmine-standalone-2.0.0-rc5/lib/jasmine-2.0.0-rc5/jasmine-html',
      'boot': 'vendor/jasmine/dist/jasmine-standalone-2.0.0-rc5/lib/jasmine-2.0.0-rc5/boot'

    },
    shim: {
      'jquery-tmpl': {
        deps: ['jquery']
      },
      'jasmine': {
        exports: 'window.jasmineRequire'
      },
      'jasmine-html': {
        deps: ['jasmine'],
        exports: 'window.jasmineRequire'
      },
      'boot': {
        deps: ['jasmine', 'jasmine-html'],
        exports: 'window.jasmineRequire'
      }
    }
  });

  // Define all of your specs here. These are RequireJS modules.
  var specs = [
  '../test/spec/js/gameSpec'
  ];

    // Load Jasmine - This will still create all of the normal Jasmine browser globals unless `boot.js` is re-written to use the
  // AMD or UMD specs. `boot.js` will do a bunch of configuration and attach it's initializers to `window.onload()`. Because
  // we are using RequireJS `window.onload()` has already been triggered so we have to manually call it again. This will
  // initialize the HTML Reporter and execute the environment.
  require(['boot'], function () {

    // Load the specs
    require(specs, function () {

      // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
      window.onload();
    });
  });
})();