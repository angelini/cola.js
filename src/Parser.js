define([
  'underscore',
  'Context',
  'bindings/ValueBinding',
  'bindings/EventBinding'
],

function(_, Context, ValueBinding, EventBinding) {

  var bindNode = function(node, context) {
      _.each([ValueBinding, EventBinding], function(Binding) {
        var bindName = node.getAttribute(Binding.ATTRIBUTE);

        if (!bindName) return;

        var binding = new Binding(node, bindName, context);
        binding.bind();
      });
  };

  function Parser(root) {
    this.root = root;
  }

  Parser.prototype.parse = function(context) {
    var node = this.root;

    context      = new Context(context);
    node.context = context;

    do {
      bindNode(node, context);
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
