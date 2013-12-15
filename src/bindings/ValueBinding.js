define([
  'underscore',
  'Property',
  'ComputedProperty'
],

function(_, Property, ComputedProperty) {

  function ValueBinding(node, bindName, context) {
    this.node = node;
    this.property = context.lookup(bindName);
  }

  ValueBinding.ATTRIBUTE = 'data-bind';

  ValueBinding.prototype.bind = function() {
    var self = this;

    if (!Property.isProperty(this.property)) {
      return this.node.value = this.property;
    }

    this.property.on('change', this.setNode.bind(this));

    if (this.isNodeEditable(this.node) && !(this.property instanceof ComputedProperty)) {
      _.each(['change', 'input', 'keyup'], function(eventName) {
        self.node.addEventListener('change', self.setProperty.bind(self));
      });
    }

    this.setNode();
  };

  ValueBinding.prototype.isNodeEditable = function(node) {
    return ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(node.nodeName.toUpperCase()) != -1;
  };

  ValueBinding.prototype.setNode = function() {
    var value = this.property.get();
    if (value) this.node.value = value;
  };

  ValueBinding.prototype.setProperty = function() {
    this.property.set(this.node.value);
  };

  return ValueBinding;

});
