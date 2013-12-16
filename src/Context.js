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

  function Context(data) {
    this.data = data || {};
  }

  Context.prototype.lookup = function(keypath) {
    return fetchKey(keypath.split('.'), this.data);
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

  return Context;

});
