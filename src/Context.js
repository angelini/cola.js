define([
  'underscore',
  'Property',
  'ComputedProperty'
],

function(_, Property, ComputedProperty) {

  function Context(data, parent) {
    this.data   = data || {};
    this.parent = parent;
  }

  Context.prototype.lookup = function(keypath) {
    var result,
        context = this;

    do {
      result = Property.lookup(keypath, context.data);
      if (result !== undefined) return result;
    } while (context = context.parent);
  };

  Context.prototype.add = function(key, value) {
    var newData = {};

    if (typeof(key) == 'object') {
      newData = key;
    } else {
      newData[key] = value;
    }

    _.extend(this.data, newData);
  };

  Context.prototype.extend = function(newData) {
    return new Context(newData, this);
  };

  return Context;

});
