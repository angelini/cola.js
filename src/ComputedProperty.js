define([
  'underscore',
  'eventemitter2',
  'PropertyStack'
],

function(_, EventEmitter, PropertyStack) {

  function ComputedProperty(getter) {
    this.dependencies = [];
    this.getter = getter;
    this.get();
  }

  _.extend(ComputedProperty.prototype, EventEmitter.prototype);

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

  return ComputedProperty;

});
