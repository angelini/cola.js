define([
  'underscore',
  'eventemitter2',

  'PropertyStack',
  'ComputedProperty'
],

function(_, EventEmitter, PropertyStack, ComputedProperty) {

  var fetchKey = function(keys, data) {
    var key = keys.shift();

    if (!key) {
      return data;
    }

    var value = Property.isProperty(data) ? data.get()[key] : data[key];

    if (!value) {
      return undefined;
    }

    return fetchKey(keys, value);
  };

  function Property(value) {
    this.value = value;
  }

  _.extend(Property.prototype, EventEmitter.prototype);

  Property.lookup = function(keypath, data) {
    return keypath ? fetchKey(keypath.split('.'), data) : data;
  };

  Property.isProperty = function(obj) {
    return obj instanceof Property || obj instanceof ComputedProperty;
  };

  Property.toProperty = function(value) {
    return Property.isProperty(value) ? value : new Property(value);
  };

  Property.prototype.get = function(keypath) {
    PropertyStack.addDependency(this);
    return Property.lookup(keypath, this.value);
  };

  Property.prototype.set = function(value) {
    var oldValue = this.value;
    this.value = value;

    if (value !== oldValue) this.emit('change', value, oldValue);

    return value;
  };

  return Property;

});
