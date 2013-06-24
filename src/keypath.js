var Property = require('./property');

function Keypath(name, property) {
  this.name = name;
  this.property = property;

  Keypath.map[name] = property;
}

Keypath.map = {};

Keypath.lookup = function(name) {
  if (!Keypath.map[name]) {
    new Keypath(name, new Property());
  }

  return Keypath.map[name];
};

Keypath.empty = function() {
  Keypath.map = {};
};

module.exports = Keypath;
