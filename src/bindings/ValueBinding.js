define([
  'underscore',
  'Property',
  'ComputedProperty'
],

function(_, Property, ComputedProperty) {

  function ValueBinding(node, bindName, context) {
    this.node  = node;
    this.value = context.lookup(bindName);
  }

  ValueBinding.ATTRIBUTE = 'data-bind';

  ValueBinding.prototype.bind = function() {
    var self = this;

    if (Property.isProperty(this.value)) {
      this.value.on('change', this.setNode.bind(this));

      if (this.isNodeEditable(this.node) && !(this.value instanceof ComputedProperty)) {
        _.each(['change', 'input', 'keyup'], function(eventName) {
          self.node.addEventListener('change', self.setValue.bind(self));
        });
      }
    }

    this.setNode();
  };

  ValueBinding.prototype.isNodeEditable = function(node) {
    return ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(node.nodeName.toUpperCase()) != -1;
  };

  ValueBinding.prototype.setNode = function() {
    var value = Property.isProperty(this.value) ? this.value.get() : this.value;

    if (!value) {
      value = '';
    }

    if (this.isNodeEditable(this.node)) {
      this.node.value = value;
    } else {
      this.node.innerHTML = value;
    }
  };

  ValueBinding.prototype.setValue = function() {
    this.value.set(this.node.value);
  };

  return ValueBinding;

});
