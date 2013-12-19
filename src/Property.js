define([
  'underscore',
  'eventemitter2',

  'PropertyStack',
  'ComputedProperty'
],

function(_, EventEmitter, PropertyStack, ComputedProperty) {

  function Property(value) {
    this.value = value;
  }

  _.extend(Property.prototype, EventEmitter.prototype);

  Property.isProperty = function(obj) {
    return obj instanceof Property || obj instanceof ComputedProperty;
  };

  Property.prototype.get = function() {
    PropertyStack.addDependency(this);
    return this.value;
  };

  Property.prototype.set = function(value) {
    var oldValue = this.value;
    this.value = value;

    if (value !== oldValue) this.emit('change', value, oldValue);

    return value;
  };

  return Property;

});
