var _             = require('underscore');
var util          = require('util');
var EventEmitter  = require('events').EventEmitter;
var PropertyStack = require('./property_stack');

function ComputedProperty(getter) {
  this.dependencies = [];
  this.getter = getter;
  this.get();
}

util.inherits(ComputedProperty, EventEmitter);

ComputedProperty.prototype.addDependency = function(property) {
  this.boundGet = this.get.bind(this);

  property.on('change', this.boundGet);
  this.dependencies.push(property);
};

ComputedProperty.prototype.get = function() {
  this.clearDependencies();

  PropertyStack.addDependency(this);
  PropertyStack.push(this);

  var oldValue = this.value;
  var newValue = this.getter();

  if (newValue != oldValue) {
    this.value = newValue;
    this.emit('change', newValue, oldValue);
  }

  PropertyStack.pop();
  return this.value;
};

ComputedProperty.prototype.clearDependencies = function() {
  var self = this;

  _.each(this.dependencies, function(dep) {
    dep.removeListener('change', self.boundGet);
  });

  this.dependencies = [];
};

module.exports = ComputedProperty;
