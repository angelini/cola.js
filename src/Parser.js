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
    var skip = !!_.some(orderedBindings, function(Binding) {
      var bindName = node.getAttribute(Binding.ATTRIBUTE);

      if (!bindName) return;

      var binding = new Binding(node, bindName, context),
          newNode = binding.bind();

      if (Binding.SKIP_CHILDREN) {
        node = newNode;
        return true;
      }
    });

    return [skip, node];
  };

  function Parser(root) {
    this.root = root;
  }

  Parser.prototype.parse = function(context) {
    var node         = this.root,
        skipChildren = false;

    if (!(context instanceof Context)) {
      context = new Context(context);
    }

    node.context = context;

    do {
      bindingResult = bindNode(node, context);
      node = bindingResult[1];
    } while (node = this.nextNode(node, bindingResult[0]));
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
