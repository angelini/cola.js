var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return (/Spec\.js$/).test(file);
});

require.config({

  baseUrl: '/base',

  paths: {
    underscore: 'vendor/underscore',
    eventemitter2: 'vendor/eventemitter2',
    mapleTree: 'vendor/mapleTree'
  },

  shim: {
    underscore: {
      exports: '_'
    },

    eventemitter2: {
      exports: 'EventEmitter2'
    },

    mapleTree: {
      exports: 'RouteTree'
    }
  },

  deps: tests,

  callback: window.__karma__.start

});
