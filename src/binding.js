var _    = require('underscore');
var ever = require('ever');

function Binding(node, property) {
  this.node = node;
  this.property = property;
}

Binding.prototype.bind = function() {
  var self = this;

  this.property.on('change', function(value) {
    self.node.value = value;
  });

  if (this.isNodeEditable(this.node)) {
    ever(this.node).on('change', function() {
      self.property.set(self.node.value);
    });
  }
};

Binding.prototype.isNodeEditable = function(node) {
  return ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(node.nodeName.toUpperCase()) != -1;
};

module.exports = Binding;
