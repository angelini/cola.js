define([
  'Binding'
],

function(Binding) {

  function Parser(root) {
    this.root = root;
  }

  Parser.prototype.parse = function(context) {
    var node = this.root;

    do {
      var bindName = node.getAttribute('data-bind');

      if (!bindName) continue;
    node.context = context;

      var binding = new Binding(node, context.lookup(bindName));
      binding.bind();
    } while (node = this.nextNode(node));
  };

  Parser.prototype.nextNode = function(node) {
    var next;
    var parent = node.parentElement;

    if (next = node.firstElementChild) return next;
    if (next = node.nextElementSibling) return next;

    while (parent) {
      if (next = parent.nextElementSibling) return next;
      parent = parent.parentElement;
    }

    return;
  };

  return Parser;

});
