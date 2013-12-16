define([
  'underscore',

  'Context',
  'bindings/ValueBinding',
  'bindings/EventBinding',
  'bindings/IteratorBinding'
],

function(_, Context, ValueBinding, EventBinding, IteratorBinding) {

  var orderedBindings = [
    IteratorBinding, ValueBinding, EventBinding
  ];

  var bindNode = function(node, context) {
    return !!_.some(orderedBindings, function(Binding) {
      var bindName = node.getAttribute(Binding.ATTRIBUTE);

      if (!bindName) return;

      var binding = new Binding(node, bindName, context);
      binding.bind();

      if (Binding.SKIP_CHILDREN) return true;
    });
  };

  function Parser(root) {
    this.root = root;
  }

  Parser.prototype.parse = function(context) {
    var node         = this.root,
        skipChildren = false;

    context      = new Context(context);
    node.context = context;

    do {
      skipChildren = bindNode(node, context);
    } while (node = this.nextNode(node, skipChildren));
  };

  Parser.prototype.nextNode = function(node, skipChildren) {
    var next,
        parent = node.parentElement;

    if ((next = node.firstElementChild) && !skipChildren) return next;
    if (next = node.nextElementSibling) return next;

    while (parent) {
      if (next = parent.nextElementSibling) return next;
      parent = parent.parentElement;
    }

    return;
  };

  return Parser;

});
