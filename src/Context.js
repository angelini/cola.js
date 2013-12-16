define([
  'underscore',
  'Property',
  'ComputedProperty'
],

function(_, Property, ComputedProperty) {

  var fetchKey = function(keys, data) {
    var key = keys.shift();

    if (!key) {
      return data;
    }

    var value = Property.isProperty(data)? data.get()[key] : data[key];

    if (!value) {
      return undefined;
    }

    return fetchKey(keys, value);
  };

  function Context(data, parent) {
    this.data   = data || {};
    this.parent = parent;
  }

  Context.prototype.lookup = function(keypath) {
    var result,
        context = this;

    do {
      result = fetchKey(keypath.split('.'), context.data);
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
