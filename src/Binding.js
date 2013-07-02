define([
  'underscore',
  'src/ComputedProperty'
],

function(_, ComputedProperty) {

  function Binding(node, property) {
    this.node = node;
    this.property = property;
  }

  Binding.prototype.bind = function() {
    var self = this;

    this.property.on('change', this.setNode.bind(this));

    if (this.isNodeEditable(this.node) && !(this.property instanceof ComputedProperty)) {
      this.node.addEventListener('change', this.setProperty.bind(this));
    }

    this.setNode();
  };

  Binding.prototype.isNodeEditable = function(node) {
    return ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(node.nodeName.toUpperCase()) != -1;
  };

  Binding.prototype.setNode = function() {
    var value = this.property.get();
    if (value) this.node.value = value;
  };

  Binding.prototype.setProperty = function() {
    this.property.set(this.node.value);
  };

  return Binding;

});
