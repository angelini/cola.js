function Binding(node, property) {
  this.node = node;
  this.property = property;
}

Binding.prototype.bind = function() {
  var self = this;

  this.property.on('change', function(value) {
    self.node.value = value;
  });
};

module.exports = Binding;
