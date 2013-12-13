var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return (/Spec\.js$/).test(file);
});

require.config({

  baseUrl: '/base/src',

  paths: {
    underscore:    '../vendor/underscore',
    eventemitter2: '../vendor/eventemitter2'
  },

  shim: {
    underscore: {
      exports: '_'
    },

    eventemitter2: {
      exports: 'EventEmitter2'
    }
  },

  deps: tests,

  callback: window.__karma__.start

});
