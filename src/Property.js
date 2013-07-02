define([
  'underscore',
  'eventemitter2',
  'src/PropertyStack'
],

function(_, EventEmitter, PropertyStack) {

  function Property(value) {
    this.value = value;
  }

  _.extend(Property.prototype, EventEmitter.prototype);

  Property.prototype.get = function() {
    PropertyStack.addDependency(this);
    return this.value;
  };

  Property.prototype.set = function(value) {
    var oldValue = this.value;

    this.value = value;
    this.emit('change', value, oldValue);

    return value;
  };

  return Property;

});
