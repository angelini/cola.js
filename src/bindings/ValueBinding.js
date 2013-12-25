define([
  'underscore',
  'Property',
  'ComputedProperty'
],

function(_, Property, ComputedProperty) {

  var isNodeEditable = function(node) {
    return ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(node.nodeName) != -1;
  };

  var nodeValueProperty = function(node) {
    switch (node.nodeName) {
      case 'INPUT':
        if (node.type == 'checkbox') return 'checked';
        return 'value';

      case 'TEXTAREA':
        return 'value';

      case 'SELECT':
        return 'value';

      default:
        return 'innerHTML';
    }
  };

  function ValueBinding(node, bindName, context) {
    this.node  = node;
    this.value = context.lookup(bindName);
  }

  ValueBinding.ATTRIBUTE = 'data-bind';

  ValueBinding.prototype.bind = function() {
    var self = this;

    if (Property.isProperty(this.value)) {
      this.value.on('change', this.setNode.bind(this));

      if (isNodeEditable(this.node) && !(this.value instanceof ComputedProperty)) {
        _.each(['change', 'input', 'keyup'], function(eventName) {
          self.node.addEventListener('change', self.setValue.bind(self));
        });
      }
    }

    this.setNode();
  };

  ValueBinding.prototype.setNode = function() {
    var value = Property.isProperty(this.value) ? this.value.get() : this.value;

    if (!value) {
      value = '';
    }

    this.node[nodeValueProperty(this.node)] = value;
  };

  ValueBinding.prototype.setValue = function() {
    this.value.set(this.node[nodeValueProperty(this.node)]);
  };

  return ValueBinding;

});
