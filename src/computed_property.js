var _             = require('underscore');
var util          = require('util');
var EventEmitter  = require('events').EventEmitter;

function ComputedProperty(options) {
  if (_.isFunction(options)) options = {get: options};

  this.dependencies = [];

  this.value = options.defaultValue;
  this.getter = options.get;
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

  this.value = this.getter();

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
