define([
  'underscore',
  'require',

  'Property',
  'Parser'
],

function(_, require, Property, Parser) {

  function IteratorBinding(node, bindName, context) {
    var nameSplit = bindName.split(':');

    if (nameSplit.length != 2) {
      throw new Error('Invalid data-iterator binding');
    }

    this.node      = node;
    this.iteration = nameSplit[0];
    this.context   = context;
    this.list      = context.lookup(nameSplit[1]);

    this.iterations  = [];
    this.commentNode = document.createComment('data-iterator-' + nameSplit[1]);

    this.parent = this.node.parentElement;
    this.clone  = node.cloneNode(true);
    this.clone.removeAttribute(IteratorBinding.ATTRIBUTE);
  }

  IteratorBinding.ATTRIBUTE = 'data-iterator';
  IteratorBinding.SKIP_CHILDREN = true;

  IteratorBinding.prototype.bind = function() {
    this.parent.insertBefore(this.commentNode, this.node.nexElementSibling);
    this.node.remove();

    if (Property.isProperty(this.list)) {
      this.list.on('change', this.createIterations.bind(this));
    }

    this.createIterations();
  };

  IteratorBinding.prototype.createIterations = function() {
    var self = this,
        list = Property.isProperty(this.list) ? this.list.get() : this.list;

    _.each(this.iterations, function(iteration) { iteration.remove(); });
    this.iterations = [];

    _.each(list, function(element) {
      var newContext = {},
          clone      = self.clone.cloneNode(true),
          parser     = new (require('Parser'))(clone);

      newContext[self.iteration] = element;
      parser.parse(self.context.extend(newContext).data);

      self.iterations.push(clone);
      self.parent.insertBefore(clone, self.commentNode);
    });
  };

  return IteratorBinding;

});
