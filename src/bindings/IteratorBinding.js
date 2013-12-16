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

    this.iterations  = [this.node];
    this.commentNode = document.createComment('data-iterator-' + nameSplit[1]);

    this.node.removeAttribute(IteratorBinding.ATTRIBUTE);
    this.parent = this.node.parentElement;
    this.clone  = node.cloneNode(true);
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

    return this.commentNode;
  };

  IteratorBinding.prototype.createIterations = function() {
    var self = this,
        list = Property.isProperty(this.list) ? this.list.get() : this.list;

    var count = 0;
    _.each(list, function(element) {
      var newNode,
          newContext = {};

      if (self.iterations[count++]) {
        newNode = self.iterations[count - 1];
      } else {
        newNode = self.clone.cloneNode(true);
        self.iterations.push(newNode);
      }

      var parser = new (require('Parser'))(newNode);

      newContext[self.iteration] = element;
      parser.parse(self.context.extend(newContext));

      self.parent.insertBefore(newNode, self.commentNode);
    });

    var extraCount = this.iterations.length - _.size(list);
    _.times(Math.max(extraCount, 0), function() {
      self.iterations.pop().remove();
    });
  };

  return IteratorBinding;

});
