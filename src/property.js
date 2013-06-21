var util          = require('util');
var EventEmitter  = require('events').EventEmitter;
var PropertyStack = require('./property_stack');

function Property(value) {
  this.value = value;
}

util.inherits(Property, EventEmitter);

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

module.exports = Property;
